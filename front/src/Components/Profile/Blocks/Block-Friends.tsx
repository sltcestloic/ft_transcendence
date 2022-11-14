import { useState } from "react";
import { IconDotsVertical } from '@tabler/icons';

import { UserInterface } from "../../../Types/User-Types";
import FriendListModal from "../Friend-Dropdown";
import Avatar from "../../../Images-Icons/pp.jpg";
import { Link } from "react-router-dom";

function FriendItem(props: {name: string, profilPic: string}) {
    const {name, profilPic} = props;

    const [showModal, setShowModal] = useState<boolean>(false);

    const handleClick = () => {
        setShowModal(!showModal);
    }

    return (
        <div className="friend-item">
            <div className="friend-content">
                <img className='friend-avatar' src={profilPic} alt="profil pic" />
                <Link to={`/profile/${name}`}>
                    { name }
                </Link>
            </div>
            <div className="friend-item-menu">
                <IconDotsVertical onClick={() => handleClick()} />
                <FriendListModal show={showModal} onClickOutside={() => {setShowModal(false)}}/>
            </div>
        </div>
    );
}

function BlockFriends(props: {friendList: UserInterface[]}) {
    const {friendList} = props;
    return friendList.length > 0 ? (
        <div className="profile-block-wrapper friends-list">
            {
                friendList.map((elem, index) =>
                    <FriendItem key={index} name={elem.username} profilPic={Avatar} />
                )
            }
        </div>
    ) : (
        <p className="err-no-datas"> No Friends yet </p>
    );
}

export default BlockFriends;