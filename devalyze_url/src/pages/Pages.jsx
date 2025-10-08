import React, {useState} from 'react'
import AddIcon from '@mui/icons-material/Add';
import BasicModal from "../components/smoothui/ui/BasicModal.jsx";


function Pages() {
    const [getImage, setGetImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [profile,setProfile] = useState({
        username: "",
        bio:""
    });
    const HandleChange =(e) => {
        const {name, value} = e.target;
        setProfile({...profile, [name]: value});
    }
    function handleGetImage(e) {
        const file = e.target.files[0];
        if (file) {
            setGetImage(URL.createObjectURL(file));
        }
    }
    function RemoveImages() {
        setGetImage(null);
    }
  return (
    <div className='p-4 bg-gray-100'>
        <div className='border rounded-md bg-white p-5 flex flex-col gap-5'>
            <nav className='border-b border-gray-100 pb-2'>
                <h1 className='text-4xl font-semibold '>Create Pages</h1>
            </nav>
            <div className={`flex gap-3`}>
                <div className={`flex-2/3 gap-3 flex flex-col`}>
                    <main className={`pb-2 min-h-100 flex flex-col gap-5`}>
                        <div className='flex gap-3 items-center p-2 px-4'>
                            <div className="flex gap-3 items-center border border-gray-300 h-30 w-40 rounded-full overflow-hidden">
                                {getImage ? (
                                    <img
                                        src={getImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover object-top"
                                    />
                                ) : (
                                    <p className="text-gray-400 text-sm text-center w-full">No image selected</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 p-2 w-full">
                                <input
                                    id="fileInput"
                                    type="file"
                                    onChange={handleGetImage}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="fileInput"
                                    className="bg-blue-600 text-white px-5 py-3 cursor-pointer rounded-md flex items-center gap-2 font-semibold shadow-lg justify-center font-instrument text-lg"
                                >
                                    Pick an Image
                                </label>

                                <button
                                    onClick={RemoveImages}
                                    className="outline-[#4E61F6] border border-gray-300 px-5 py-3 cursor-pointer rounded-md flex items-center gap-2 font-semibold shadow-lg justify-center font-instrument text-lg"
                                >
                                    Remove
                                </button>
                            </div>

                        </div>
                        <div className='flex flex-col gap-2 items-center'>
                            <div className={`flex flex-col w-[95%] p-2 bg-[#F6F7F5] rounded-sm`}>
                                <label htmlFor="" className={`text-lg font-medium`}>Profile Title</label>
                                <input type="text" name={`username`} placeholder='Name' className='outline-none py-2 rounded-md w-full' value={profile.username} onChange={HandleChange}/>
                            </div>
                            <div className={`flex flex-col w-[95%] p-2 bg-[#F6F7F5] rounded-sm`}>
                                <label htmlFor="" className={`text-lg font-medium`}>Bio</label>
                                <input type="text" placeholder='details' name={`bio`} className='outline-none py-2 rounded-md w-full' value={profile.bio} onChange={HandleChange} />
                            </div>
                        </div>
                        <hr className='border-gray-300 w-full'/>
                        <button onClick={()=> setOpen(true)} className={`flex gap-1 items-center p-2 px-4 ml-5`}>
                            <AddIcon className='text-blue-600' sx={{ fontSize: 30 }}/>
                            <p className={`text-blue-600 font-medium text-md`}>Add link & social icons</p>

                        </button>
                        <BasicModal
                            isOpen={open}
                            onClose={() => setOpen(false)}
                            title="Example Modal"
                            size="md"
                        >
                            <p className="text-gray-700">This is the modal content.</p>
                        </BasicModal>
                    </main>
                    <div className='flex gap-2 p-2 min-h-100 border'>
                        <h1 className={`text-4xl font-semibold pt-3 pl-3`}>Theme</h1>
                        <div>
                            
                        </div>

                    </div>

                </div>
                <aside className=' p-2 py-5 min-h-120 flex-1/3 flex items-start gap-2 justify-center'>
                    {/*profile*/}
                    <div className='flex flex-col gap-1 items-center justify-center'>
                        <div className="flex gap-3 items-center border-2 border-red-800 h-40 w-40 rounded-full overflow-hidden text-center font-instrument">
                            {getImage ? (
                                <img
                                    src={getImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover object-top"
                                />
                            ) : (
                                <p className="text-gray-400 text-sm text-center w-full">Select an Image</p>
                            )}
                        </div>
                        <h1 className={`text-black text-3xl font-bold`}>{profile.username ? profile.username : 'Input your Name...'}</h1>
                        <p className={`text-[#292929] text-center text-md font-medium `}>{profile.bio ? profile.bio : 'Input your Bio...'}</p>
                        <span>

                        </span>
                    </div>
                </aside>
            </div>
        </div>
    </div>
  )
}

export default Pages