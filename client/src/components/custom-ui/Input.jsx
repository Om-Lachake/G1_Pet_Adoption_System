const Input = ({ icon: Icon,iconKeep='true',iconColor='text-gray-500 ',textColor='text-white ',borderColor=' border-blue-700' ,bgColor = ' bg-blue-500 ',placeHolderColor='placeholder-zinc-100', ...props }) => {
	return (
	  <div className='relative mb-6'>
		{iconKeep === 'true' && <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
		  <Icon className={size-5 ${iconColor}} />
		</div>}
		<input
		  {...props}
		  className={w-full ${iconKeep === "true" ? "pl-10" : "pl-4"} pr-3 py-2 ${bgColor} opacity-85 rounded-lg border ${borderColor} ${textColor}  ${placeHolderColor} transition duration-200}
		/>
	  </div>
	);
  };
  export default Input;
