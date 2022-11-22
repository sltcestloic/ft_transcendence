import 'phaser';
import { 
		PlayerStatus,
		PlayerType,
		LobbyStatus, 
		RoundSetup,
		EndResult,
		GameType} from '../types/shared.types';
import { io, Socket } from "socket.io-client";
import ClientSocketManager from '../client.socket.manager';
//import AssetButton from '../../../../Assets/images/button.png';


export default class Lobby extends Phaser.Scene
{
	constructor ()
	{
		super({ key: 'Lobby' });
	}

	socketmanager?: ClientSocketManager;

	TeamBlue_Back_avatar?: Phaser.GameObjects.Image;
	TeamBlue_Back_indicator?: Phaser.GameObjects.Shape;
	TeamBlue_Back_name?: Phaser.GameObjects.Text;
	TeamBlue_Back_win?: Phaser.GameObjects.Text;
	TeamBlue_Back_loss?: Phaser.GameObjects.Text;
	
	TeamBlue_Front_avatar?: Phaser.GameObjects.Image;
	TeamBlue_Front_indicator?: Phaser.GameObjects.Shape;
	TeamBlue_Front_name?: Phaser.GameObjects.Text;
	TeamBlue_Front_win?: Phaser.GameObjects.Text;
	TeamBlue_Front_loss?: Phaser.GameObjects.Text;

	TeamRed_Front_avatar?: Phaser.GameObjects.Image;
	TeamRed_Front_indicator?: Phaser.GameObjects.Shape;
	TeamRed_Front_name?: Phaser.GameObjects.Text;
	TeamRed_Front_win?: Phaser.GameObjects.Text;
	TeamRed_Front_loss?: Phaser.GameObjects.Text;

	TeamRed_Back_avatar?: Phaser.GameObjects.Image;
	TeamRed_Back_indicator?: Phaser.GameObjects.Shape;
	TeamRed_Back_name?: Phaser.GameObjects.Text;
	TeamRed_Back_win?: Phaser.GameObjects.Text;
	TeamRed_Back_loss?: Phaser.GameObjects.Text;
	

	// ready_button?: Phaser.GameObjects.Image;
	countdown?: Phaser.GameObjects.Text;


	game_type: GameType = GameType.Singles;
	me: PlayerType = PlayerType.Spectator;
	lobbystatus: LobbyStatus = 
	{
		TeamBlue_Back: PlayerStatus.Absent,
		TeamBlue_Front: PlayerStatus.Absent,
		TeamRed_Front: PlayerStatus.Absent,
		TeamRed_Back: PlayerStatus.Absent,
	}

	anti_spam_count :number = 0;
	wait_delay: number = 0;
	connected: boolean = false;
	launching_game: boolean = false;


	preload ()
	{
		this.load.image(
			'TeamBlue_back_avatar',
			this.game.registry.get('players_data').TeamBlue_Back.avatar
			);
		this.load.image(
			'TeamRed_back_avatar',
			this.game.registry.get('players_data').TeamRed_Back.avatar
			);

		// 	this.load.image(
		// 	'player_a_back_avatar',
		// 	this.game.registry.get('players_data').Player_A_Back.user.avatar
		// 	);
		// this.load.image(
		// 	'player_b_back_avatar',
		// 	this.game.registry.get('players_data').Player_B_Back.user.avatar
		// 	);


		// this.load.image(
		// 	'button',
		// 	AssetButton
		// 	);

		this.game_type = this.game.registry.get('players_data').game_settings.game_type;

		if (this.game_type === GameType.Doubles)
		{
			this.load.image(
				'TeamBlue_front_avatar',
				this.game.registry.get('players_data').TeamBlue_Front.avatar
				);
			this.load.image(
				'TeamRed_front_avatar',
				this.game.registry.get('players_data').TeamRed_Front.avatar
				);

			// this.load.image(
			// 	'player_a_front_avatar',
			// 	this.game.registry.get('players_data').user.Player_A_Front.avatar
			// 	);
			// this.load.image(
			// 	'player_b_front_avatar',
			// 	this.game.registry.get('players_data').user.Player_B_Front.avatar
			// 	);

		}
	}

	create ()
	{
		this.me = this.game.registry.get('players_data').player_type;
		this.socketmanager = new ClientSocketManager(this.game.registry.get('socket'));
		this.game.registry.set('socketmanager', this.socketmanager);

        this.socketmanager.set_lobby_triggers({
            ready_to_go: this.ready_to_go.bind(this),
			update_lobby_status: this.update_lobby_status.bind(this),
			store_round_setup: this.store_round_setup.bind(this),
			lobby_join: this.lobby_join.bind(this),
			game_end: this.game_end.bind(this)
        });

		this.TeamBlue_Back_avatar = this.add.image(130, 130, 'TeamBlue_back_avatar')
								.setOrigin(0.5,0.5)
								.setDisplaySize(150, 150);
		this.TeamRed_Back_avatar = this.add.image(670, 130, 'TeamRed_back_avatar')
								.setOrigin(0.5,0.5)
								.setDisplaySize(150, 150);

		this.TeamBlue_Back_indicator = this.add.circle(150, 240, 50, 0x000000);
		this.TeamRed_Back_indicator = this.add.circle(650, 240, 50, 0x000000);

		let style: Phaser.Types.GameObjects.Text.TextStyle = 
		{
			fontSize: '30px',
			color: '#000000',
			fontFamily: 'Arial'
		}
		this.TeamBlue_Back_win = this.add.text(100, 320, "Win:" + this.game.registry.get('players_data').TeamBlue_Back.win, style);
		this.TeamBlue_Back_loss = this.add.text(100, 360, "Loss:" + this.game.registry.get('players_data').TeamBlue_Back.loss, style);
		this.TeamRed_Back_win = this.add.text(700, 320, "Win:" + this.game.registry.get('players_data').TeamRed_Back.win, style);
		this.TeamRed_Back_loss = this.add.text(700, 360, "Loss:" + this.game.registry.get('players_data').TeamRed_Back.loss, style);


		if (this.game_type === GameType.Doubles)
		{
			this.TeamBlue_Front_avatar = this.add.image(280, 130, 'TeamBlue_front_avatar')
								.setOrigin(0.5,0.5)
								.setDisplaySize(150, 150);
			this.TeamRed_Front_avatar = this.add.image(520, 130, 'TeamRed_front_avatar')
								.setOrigin(0.5,0.5)
								.setDisplaySize(150, 150);

			this.TeamBlue_Front_indicator = this.add.circle(300, 240, 50, 0x000000);
			this.TeamRed_Front_indicator = this.add.circle(500, 240, 50, 0x000000);

			this.TeamBlue_Front_win = this.add.text(300, 320, "Win:" + this.game.registry.get('players_data').TeamBlue_Front.win, style);
			this.TeamBlue_Front_loss = this.add.text(300, 360, "Loss:" + this.game.registry.get('players_data').TeamBlue_Front.loss, style);
			this.TeamRed_Front_win = this.add.text(500, 320, "Win:" + this.game.registry.get('players_data').TeamRed_Front.win, style);
			this.TeamRed_Front_loss = this.add.text(500, 360, "Loss:" + this.game.registry.get('players_data').TeamRed_Front.loss, style);
		
		}

		// if (this.me !== PlayerType.Spectator)
		// {
		// 	this.ready_button = this.add.image(400, 400, 'button')
		// 							.setOrigin(0.5,0.5).setName('ready')
		// 							.setDisplaySize(200, 200)
		// 							.setInteractive();
		// }

		this.socketmanager.lobby_send_join(this.game.registry.get('players_data').game_id);

		if (this.me !== PlayerType.Spectator)
		{
			this.input.on('gameobjectdown',this.click_event);
		}
		this.socketmanager.lobby_send_request_status(this.registry.get('players_data').game_id);
	}

	update(): void
	{
		this.anti_spam_count++;
		if (this.anti_spam_count >= 5)
		{
			this.socketmanager!.lobby_send_request_status(this.registry.get('players_data').game_id);
			this.anti_spam_count = 0;
		}

		if (!this.connected)
		{
			this.wait_delay++;
			if (this.wait_delay >= 200)
			{
	
				this.server_connect_fail();
			}

		}
	}

	click_event = (pointer: Phaser.Input.Pointer ,gameobject :Phaser.GameObjects.GameObject) =>
	{
		pointer;
		gameobject;

		// if (gameobject.name === 'ready')
		// {
		// 	this.socketmanager!.lobby_send_ready(this.registry.get('players_data').game_id);
		// 	gameobject.destroy();
		// }

		// if (gameobject.name === 'exit')
		// {
		// 	this.game.destroy(true, false);
		// }
	}

	update_lobby_status = (new_status: LobbyStatus) =>
	{
		this.lobbystatus = new_status;

		if (this.lobbystatus.TeamBlue_Back === PlayerStatus.Present)
		{
			this.TeamBlue_Back_indicator?.setFillStyle(0xf2fc23);
		}
		else if (this.lobbystatus.TeamBlue_Back === PlayerStatus.Ready)
		{
			this.TeamBlue_Back_indicator?.setFillStyle(0x43f33b);
		}
		else
		{
			this.TeamBlue_Back_indicator?.setFillStyle(0xff0000);
		}

		if (this.lobbystatus.TeamRed_Back === PlayerStatus.Present)
		{
			this.TeamRed_Back_indicator?.setFillStyle(0xf2fc23);
		}
		else if (this.lobbystatus.TeamRed_Back === PlayerStatus.Ready)
		{
			this.TeamRed_Back_indicator?.setFillStyle(0x43f33b);
		}
		else
		{
			this.TeamRed_Back_indicator?.setFillStyle(0xff0000);
		}


		if (this.game_type === GameType.Doubles)
		{
			if (this.lobbystatus.TeamBlue_Front === PlayerStatus.Present)
			{
				this.TeamBlue_Front_indicator?.setFillStyle(0xf2fc23);
			}
			else if (this.lobbystatus.TeamBlue_Front === PlayerStatus.Ready)
			{
				this.TeamBlue_Front_indicator?.setFillStyle(0x43f33b);
			}
			else
			{
				this.TeamBlue_Front_indicator?.setFillStyle(0xff0000);
			}
	
			if (this.lobbystatus.TeamRed_Front === PlayerStatus.Present)
			{
				this.TeamRed_Front_indicator?.setFillStyle(0xf2fc23);
			}
			else if (this.lobbystatus.TeamRed_Front === PlayerStatus.Ready)
			{
				this.TeamRed_Front_indicator?.setFillStyle(0x43f33b);
			}
			else
			{
				this.TeamRed_Front_indicator?.setFillStyle(0xff0000);
			}	
		}

	}

	ready_to_go = (/*express: boolean = false*/) =>
	{
		if (this.launching_game)
			return;
		
		this.launching_game = true;

		this.update_lobby_status(
			{
				TeamBlue_Back: PlayerStatus.Ready,
				TeamBlue_Front: PlayerStatus.Ready,
				TeamRed_Front: PlayerStatus.Ready,
				TeamRed_Back: PlayerStatus.Ready,
			});


		this.socketmanager!.game_get_round_setup(this.game.registry.get('players_data').game_id);


		// let timer: number;
		// if(express)
		// 	timer = 1;
		// else
		// 	timer = 5;

		// let style: Phaser.Types.GameObjects.Text.TextStyle = 
		// {
		// 	fontSize: '40px',
		// 	color: '#000000',
		// 	fontFamily: 'Arial'
		// }

		// this.countdown = this.add.text(400, 100, timer.toString(), style);

		// this.time.addEvent({
		// 	delay: 1000,
		// 	callback: () =>
		// 	{
		// 		timer -= 1;
		// 		this.countdown!.setText(timer.toString());
		// 		if (timer <= 0)
		// 		{
		// 			// this.countdown.destroy();
		// 			this.launch_pong();
		// 		}
		// 	},
		// 	callbackScope: this,
		// 	loop: true });


		setTimeout(() => { 
			this.cameras.main.fadeOut(1000, 0, 0, 0);

		}, 1500);

		setTimeout(() => { 
			this.scene.start('Pong');
		}, 2500);
	}

	store_round_setup = (round_setup: RoundSetup) =>
	{
		this.game.registry.set('round_setup', round_setup);
	}

	launch_pong = () =>
	{
		console.log('imagine the screen fading to black');

		this.scene.start('Pong');
	}

	clear_all = () =>
	{
		this.TeamBlue_Back_avatar?.destroy();
		this.TeamBlue_Back_indicator?.destroy();
		this.TeamBlue_Back_name?.destroy();
		this.TeamBlue_Back_win?.destroy();
		this.TeamBlue_Back_loss?.destroy();

		this.TeamRed_Back_avatar?.destroy();
		this.TeamRed_Back_indicator?.destroy();
		this.TeamRed_Back_name?.destroy();
		this.TeamRed_Back_win?.destroy();
		this.TeamRed_Back_loss?.destroy();

		if (this.game_type === GameType.Doubles)
		{
			this.TeamBlue_Front_avatar?.destroy();
			this.TeamBlue_Front_indicator?.destroy();
			this.TeamBlue_Front_name?.destroy();
			this.TeamBlue_Front_win?.destroy();
			this.TeamBlue_Front_loss?.destroy();
		
			this.TeamRed_Front_avatar?.destroy();
			this.TeamRed_Front_indicator?.destroy();
			this.TeamRed_Front_name?.destroy();
			this.TeamRed_Front_win?.destroy();
			this.TeamRed_Front_loss?.destroy();
		}

	}


	server_connect_fail = () =>
	{
		this.clear_all();
		
		// this.ready_button = this.add.image(400, 400, 'button')
		// .setOrigin(0.5,0.5).setName('exit')
		// .setDisplaySize(200, 200)
		// .setInteractive();

		let style: Phaser.Types.GameObjects.Text.TextStyle = 
		{
			fontSize: '30px',
			color: '#000000',
			fontFamily: 'Arial'
		}

		this.countdown = this.add.text(400, 100, "Error: Could not connect to server", style);	
	}

	lobby_join = (response: boolean) =>
	{
		this.connected = true;
		if(!response)
		{
			this.clear_all();
			
			// this.ready_button = this.add.image(400, 400, 'button')
			// .setOrigin(0.5,0.5).setName('exit')
			// .setDisplaySize(200, 200)
			// .setInteractive();
	
			let style: Phaser.Types.GameObjects.Text.TextStyle = 
			{
				fontSize: '30px',
				color: '#000000',
				fontFamily: 'Arial'
			}
	
			this.countdown = this.add.text(400, 100, "Error: Lobby not found", style);

		}
	}

	game_end = (winner: EndResult) =>
	{
		this.game.registry.set('winner', winner);

		this.scene.start('MatchResult');
	}

}
