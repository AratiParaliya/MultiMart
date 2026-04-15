


const UserAvatarImg = (props) => {
    return (
        <>
        <div className={`userImg ${props.lg===true}`}>
            <span className="rounded-circle">
                <img src={props.img} />
            </span>
        </div>
        </>
    )
}
export default UserAvatarImg; 