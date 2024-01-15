const MsgWrapper = (props) => {
  return (
    <div
      className={`p-2 flex text-base ${
        props.classSide === "self" && "justify-end"
      }`}
    >
      <div className="shadow-lg rounded-md overflow-hidden max-w-[90%] p-2">
        {props.children}
      </div>
    </div>
  );
};

export default MsgWrapper;
