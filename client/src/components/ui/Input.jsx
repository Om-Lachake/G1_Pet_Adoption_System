const Input = ({ icon: Icon, ...props }) => {
	return (
		<div className='relative mb-6'>
			<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
				<Icon className='size-5 text-gray-500' />
			</div>
			<input
				{...props}
				className='w-full pl-10 pr-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 opacity-85 rounded-lg border border-blue-700  text-white placeholder-zinc-100 transition duration-200' 
			/>
		</div>
	);
};
export default Input;