import React, {useState, useContext, useEffect} from "react";
import AddIcon from "@mui/icons-material/Add";
import BasicModal from "../components/smoothui/ui/BasicModal.jsx";
import { Themecontext } from "../context/ThemeContext.jsx";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import img1 from "../assets/Frame.svg"
import img2 from "../assets/Frame2.svg"
import img3 from "../assets/Frame3.svg"
import img4 from "../assets/Frame4.svg"
import img5 from "../assets/Frame5.svg"

function Pages() {
    const { theme, setThemeByName } = useContext(Themecontext);
    const [getImage, setGetImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState({
        username: "",
        bio: "",
    });
    const [links, setLinks] = useState({
        LinkTitle: "",
        LinkUrl: "",
        socialIcon: "",
    });
    const [PopularLinks, setPopularLinks] = useState([]);
    // Remove this entire useEffect block
    const HandleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };
    const HandleChangeLink = (e) => {
        const { name, value } = e.target;
        setLinks({ ...links, [name]: value });
    }
    const HandleChangePopularLink = () => {
        if (!links.LinkTitle.trim() || !links.LinkUrl.trim()) return;

        try {
            // Extract domain from URL
            const url = new URL(links.LinkUrl.startsWith('http') ? links.LinkUrl : `https://${links.LinkUrl}`);
            const domain = url.hostname;

            // Use Google's favicon service (simpler, no fetch needed)
            const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

            // Add link with favicon
            setPopularLinks((prev) => [...prev, { ...links, socialIcon: iconUrl }]);
        } catch (error) {
            // If URL parsing fails, add without icon
            setPopularLinks((prev) => [...prev, { ...links, socialIcon: "" }]);
        }

        // Reset form
        setLinks({ LinkTitle: "", LinkUrl: "", socialIcon: "" });
        setOpen(false);
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
                                <div className="flex gap-3 items-center border border-gray-300 h-32 w-32 sm:h-35 sm:w-45 rounded-full overflow-hidden">
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

                                <div className="flex flex-col gap-2 p-2 w-full sm:w-full lg:w-full">
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
                                title="Add your link"
                                size="md"
                            >
                                <input className="text-gray-700 p-2 w-full rounded-md border-2 border-gray-200" placeholder={`Link Title`} type="text" name="LinkTitle" value={links.LinkTitle} onChange={HandleChangeLink}  />
                                <input className="text-gray-700 p-2 w-full rounded-md border-2 border-gray-200" placeholder={`Enter the Url`} type="url" name="LinkUrl" value={links.LinkUrl} onChange={HandleChangeLink}  />
                                <button className={`bg-blue-600 text-white px-5 py-2 cursor-pointer rounded-md flex items-center gap-2 font-semibold shadow-lg justify-center place-self-end text-base sm:text-lg w-fit`} onClick={HandleChangePopularLink}>Add </button>
                            </BasicModal>
                        </main>

                        {/* Theme Section */}
                        <div className="flex flex-col gap-5 p-2">
                            <h1 className="text-2xl sm:text-3xl font-semibold pt-3 pl-3">
                                Theme
                            </h1>
                            <div className="gap-5 grid grid-cols-3 p-2 w-[70%]">
                                {[
                                    { name: "custom", bg: "bg-white", text: "text-black" },
                                    { name: "lakeWhite", bg: "bg-white", text: "text-black", image: img1 },
                                    { name: "lakeBlack", bg: "bg-black", text: "text-white", image: img2 },
                                    { name: "airSmoke", bg: "bg-neutral-900", text: "text-white", image: img3 },
                                    { name: "airSnow", bg: "bg-gray-100", text: "text-black", image: img4 },
                                    { name: "airGrey", bg: "bg-gray-200", text: "text-black", image: img5 },
                                ].map((themeBtn) => (
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <button
                                            key={themeBtn.name}
                                            onClick={() => setThemeByName(themeBtn.name)}
                                            className={`relative px-2 py-2 rounded-md ${themeBtn.bg} ${themeBtn.text} ${themeBtn.name === "custom" ? "border border-dashed border-blue-600" : "border border-solid"} transition hover:opacity-80 w-full overflow-hidden`}
                                        >
                                            <img
                                                src={themeBtn.image}
                                                alt={`Theme ${themeBtn.name === "custom" ? "Custom" : themeBtn.name.charAt(0).toUpperCase() + themeBtn.name.slice(1)}`}
                                                className={`w-full object-cover rounded-md ${themeBtn.name === "custom" ? "h-55" : "h-auto"}`}
                                            />
                                        </button>
                                        <p className="text-lg font-normal">{themeBtn.name}</p>
                                    </div>

                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PREVIEW (narrower now) */}
                    <aside
                        className="p-4 py-6 flex-[1] lg:max-w-[380px] xl:max-w-[420px] w-full flex items-start justify-center rounded-md h-fit min-h-[120px]"
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

                        <div className="flex gap-2 mt-3 w-full items-center justify-center ">
                            {PopularLinks.length > 0 ? (
                                    PopularLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.LinkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-2 rounded-lg hover:opacity-80 transition place-self-center"
                                style={{
                                backgroundColor: theme?.linkBackgroundColor || '#f3f4f6',
                                borderColor: theme?.linkBorderColor || '#e5e7eb'
                            }}
                                >
                            {link.socialIcon ? (
                                <img
                                src={link.socialIcon}
                             alt="favicon"
                             className="w-10 h-10 flex-shrink-0 rounded"
                             onError={(e) => {
                                 e.target.style.display = 'none';
                             }}
                        />
                        ) : (
                        <div className="w-10 h-10 flex-shrink-0 bg-gray-300 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-600">🔗</span>
                        </div>
                        )}
                        {/*<span className="text-base font-medium">{link.LinkTitle}</span>*/}
                    </a>
                        ))
                        ) : (
                        <p className="text-gray-400 text-sm">No links added yet</p>
                        )}
                </div>
                        <div className="flex flex-col gap-5 mt-3 w-full ">
                            {PopularLinks.length > 0 ? (
                                PopularLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.LinkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-2 px-4 border rounded-full hover:opacity-80 transition"

                                    >
                                        {link.socialIcon ? (
                                            <img
                                                src={link.socialIcon}
                                                alt="favicon"
                                                className="w-10 h-10 flex-shrink-0 rounded"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 flex-shrink-0 bg-gray-300 rounded flex items-center justify-center">
                                                <span className="text-xs text-gray-600">🔗</span>
                                            </div>
                                        )}
                                        <ArrowForwardIcon />
                                        <span className="text-xl font-medium">{link.LinkTitle}</span>

                                    </a>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm">No links added yet</p>
                            )}
                        </div>

            </div>
        </aside>
                </div>
            </div>
        </div>
    );
}

export default Pages;
