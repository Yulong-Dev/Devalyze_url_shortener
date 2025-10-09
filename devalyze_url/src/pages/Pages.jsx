import React, { useState, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import BasicModal from "../components/smoothui/ui/BasicModal.jsx";
import { Themecontext } from "../context/ThemeContext.jsx";

function Pages() {
    const { theme, setThemeByName } = useContext(Themecontext);
    const [getImage, setGetImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState({
        username: "",
        bio: "",
    });

    const HandleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

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
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="border rounded-md bg-white p-5 flex flex-col gap-5">
                <nav className="border-b border-gray-100 pb-2">
                    <h1 className="text-3xl sm:text-4xl font-semibold text-center sm:text-left">
                        Create Pages
                    </h1>
                </nav>

                {/* ✅ Responsive two-column layout */}
                <div className="flex flex-col lg:flex-row gap-5 items-start">
                    {/* LEFT: MAIN FORM */}
                    <div className="flex flex-col flex-[2] min-w-0 gap-5">
                        <main className="pb-2 flex flex-col gap-5">
                            <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start p-2 px-4">
                                <div className="flex gap-3 items-center border border-gray-300 h-32 w-32 sm:h-35 sm:w-40 rounded-full overflow-hidden">
                                    {getImage ? (
                                        <img
                                            src={getImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover object-top"
                                        />
                                    ) : (
                                        <p className="text-gray-400 text-sm text-center w-full">
                                            No image selected
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 p-2 w-full sm:w-auto lg:w-full">
                                    <input
                                        id="fileInput"
                                        type="file"
                                        onChange={handleGetImage}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="fileInput"
                                        className="bg-blue-600 text-white px-5 py-3 cursor-pointer rounded-md flex items-center gap-2 font-semibold shadow-lg justify-center text-base sm:text-lg w-full"
                                    >
                                        Pick an Image
                                    </label>

                                    <button
                                        onClick={RemoveImages}
                                        className="border border-gray-300 px-5 py-3 cursor-pointer rounded-md flex items-center gap-2 font-semibold shadow-lg justify-center text-base sm:text-lg"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            {/* Profile Fields */}
                            <div className="flex flex-col gap-4 items-center">
                                <div className="flex flex-col w-full sm:w-[95%] p-2 bg-[#F6F7F5] rounded-sm">
                                    <label className="text-lg font-medium">Profile Title</label>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Name"
                                        className="outline-none py-2 rounded-md w-full text-base sm:text-lg"
                                        value={profile.username}
                                        onChange={HandleChange}
                                    />
                                </div>
                                <div className="flex flex-col w-full sm:w-[95%] p-2 bg-[#F6F7F5] rounded-sm">
                                    <label className="text-lg font-medium">Bio</label>
                                    <input
                                        type="text"
                                        placeholder="Details"
                                        name="bio"
                                        className="outline-none py-2 rounded-md w-full text-base sm:text-lg"
                                        value={profile.bio}
                                        onChange={HandleChange}
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-300 w-full" />

                            <button
                                onClick={() => setOpen(true)}
                                className="flex gap-1 items-center p-2 px-4 ml-0 sm:ml-5"
                            >
                                <AddIcon className="text-blue-600" sx={{ fontSize: 28 }} />
                                <p className="text-blue-600 font-medium text-md">
                                    Add link & social icons
                                </p>
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

                        {/* Theme Section */}
                        <div className="flex flex-col gap-5 p-2">
                            <h1 className="text-2xl sm:text-3xl font-semibold pt-3 pl-3">
                                Theme
                            </h1>
                            <div className="flex flex-wrap gap-2 p-2 w-full">
                                {[
                                    { name: "custom", bg: "bg-white", text: "text-black" },
                                    { name: "lakeWhite", bg: "bg-white", text: "text-black" },
                                    { name: "lakeBlack", bg: "bg-black", text: "text-white" },
                                    { name: "airSmoke", bg: "bg-neutral-900", text: "text-white" },
                                    { name: "airSnow", bg: "bg-gray-100", text: "text-black" },
                                    { name: "airGrey", bg: "bg-gray-200", text: "text-black" },
                                ].map((themeBtn) => (
                                    <button
                                        key={themeBtn.name}
                                        onClick={() => setThemeByName(themeBtn.name)}
                                        className={`px-4 py-2 rounded-md border ${themeBtn.bg} ${themeBtn.text} transition hover:opacity-80`}
                                    >
                                        {themeBtn.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PREVIEW (narrower now) */}
                    <aside
                        className="p-4 py-6 flex-[1] lg:max-w-[380px] xl:max-w-[420px] w-full flex items-start justify-center rounded-md self-stretch"
                        style={{
                            backgroundColor: theme?.backgroundColor || "#fff",
                            color: theme?.titleColor || "#000",
                            border: theme?.border || "1px solid #ccc",
                            boxShadow: theme?.boxShadow,
                            backdropFilter: theme?.backdropFilter,
                        }}
                    >
                        <div className="flex flex-col gap-2 items-center justify-center text-center w-full sm:w-auto">
                            <div className="flex gap-3 items-center border-2 border-red-800 h-32 w-32 sm:h-40 sm:w-40 rounded-full overflow-hidden font-instrument">
                                {getImage ? (
                                    <img
                                        src={getImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover object-top"
                                    />
                                ) : (
                                    <p className="text-gray-400 text-sm w-full">Select an Image</p>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold break-words px-2">
                                {profile.username || "Input your Name..."}
                            </h1>
                            <p className="text-center text-base sm:text-md font-medium break-words px-3">
                                {profile.bio || "Input your Bio..."}
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default Pages;
