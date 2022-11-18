
import { Exclude } from "class-transformer";
import { UserStatus } from "src/utils/types/types";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, ManyToMany, JoinTable, ManyToOne, BaseEntity } from "typeorm";
import { Avatar } from "./avatar";
import { ChannelUser } from "./channelUser";
import { Conversation } from "./conversation";
import { Friendship } from "./friendship";
import { MatchResult } from "./matchResult";
import { Statistic } from "./statistic";

@Entity()
export class User {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: true })
	@Exclude()
	id42?: number;

	@Column({ unique: true, nullable: true })
	username: string;

	@Column({ default: UserStatus.OFFLINE })
	status: UserStatus;

	@Column({ unique: true })
  	email: string;

	@Column({ nullable: true })
	avatar?: string;

	@OneToOne(() => Statistic, (statistic) => statistic.user, {
		cascade: true,
	})
	statistic: Statistic;

	@OneToMany(() => ChannelUser, (channelUser) => channelUser.user)
	channelUser: ChannelUser[];

	@ManyToMany(() => User)
	@JoinTable({ name: 'blocked_users' })
	blocked: User[];

	@Column({ default: 1000 })
	singles_elo: number;

	@Column({ default: 1000 })
	doubles_elo: number;

	@Exclude()
	@Column({ nullable: true, select: false })
	hash?: string

	@Exclude()
	@Column({ nullable: true, select: false })
	refresh_hash?: string

	@Exclude()
	@Column({ nullable: true, select: false })
	two_factor_secret?: string

	@Column({ default: false })
	two_factor_enabled: boolean;

	@Exclude()
	@Column({ default: false, select: false })
	two_factor_authenticated: boolean;

	@Exclude()
	@Column({ nullable: true, select: false })
	forgot_code?: string
} 
