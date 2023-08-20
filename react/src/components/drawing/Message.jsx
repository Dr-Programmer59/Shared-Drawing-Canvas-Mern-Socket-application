const Message = ({message, user, classs}) => {
  if(user){
    return (
        <div className={`message ${classs}`}>
            {`${user}: ${message}`}
        </div>
      )
  }else{
    return (
        <div className={`message ${classs}`}>
            {`You: ${message}`}
        </div>
      )
  }
}

export default Message;