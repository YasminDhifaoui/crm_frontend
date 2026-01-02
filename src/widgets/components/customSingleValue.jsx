export const customSingleValue = ({ data }) => (
  <div className="flex items-center">
    <img src={data.image} alt="" className="w-12 h-9 mr-3" /> {/* bigger image */}
    <span className="text-black text-lg font-semibold">{data.label}</span> {/* black & larger text */}
  </div>
);

export const customOption = (props) => {
  const { data, innerRef, innerProps, isFocused, isSelected } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={`flex items-center p-4 cursor-pointer ${
        isFocused ? "bg-gray-200" : ""
      } ${isSelected ? "bg-blue-100" : ""}`}
      style={{ minHeight: 50 }} // make each option taller
    >
      <img src={data.image} alt="" className="w-12 h-9 mr-3" /> {/* bigger image */}
      <span className="text-black text-lg font-semibold">{data.label}</span> {/* black & larger text */}
    </div>
  );
};
