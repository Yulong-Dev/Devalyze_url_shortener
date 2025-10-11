import React, { useState, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BasicModal from "../components/smoothui/ui/BasicModal.jsx";
import { Themecontext } from "../context/ThemeContext.jsx";
import img1 from "../assets/Frame.svg";
import img2 from "../assets/Frame2.svg";
import img3 from "../assets/Frame3.svg";
import img4 from "../assets/Frame4.svg";
import img5 from "../assets/Frame5.svg";

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

    const HandleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const HandleChangeLink = (e) => {
        const { name, value } = e.target;
        setLinks({ ...links, [name]: value });
    };

    const HandleChangePopularLink = () => {
        if (!links.LinkTitle.trim() || !links.LinkUrl.trim()) return;

        try {
            // Extract domain from URL
            const url = new URL(links.LinkUrl.startsWith('http') ? links.LinkUrl : `https://${links.LinkUrl}`);
            const domain = url.hostname;

            // Use Google's favicon service
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

    const HandleDeleteLink = (index) => {
        setPopularLinks((prev) => prev.filter((_, i) => i !== index));
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

                <div className="flex flex-col lg:flex-row gap-5 items-start">
                    {/* LEFT: MAIN FORM */}
                    <div className="flex flex-col flex-[2] min-w-0 gap-5">
                        <main className="pb-2 flex flex-col gap-5">
                            {/* Profile Image Upload */}
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

                                <div className="flex flex-col gap-2 p-2 w-full">
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleGetImage}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="fileInput"
                                        className="bg-blue-600 text-white px-5 py-3 cursor-pointer rounded-md flex items-center gap-2 font-semibold shadow-lg justify-center text-base sm:text-lg w-full hover:bg-blue-700 transition"
                                    >
                                        Pick an Image
                                    </label>

                                    <button
                                        onClick={RemoveImages}
                                        className="border border-gray-300 px-5 py-3 cursor-pointer rounded-md flex items-center gap-2 font-semibold shadow-lg justify-center text-base sm:text-lg hover:bg-gray-50 transition"
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
                                        className="outline-none py-2 rounded-md w-full text-base sm:text-lg bg-transparent"
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
                                        className="outline-none py-2 rounded-md w-full text-base sm:text-lg bg-transparent"
                                        value={profile.bio}
                                        onChange={HandleChange}
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-300 w-full" />

                            {/* Added Links List */}
                            {PopularLinks.length > 0 && (
                                <div className="flex flex-col gap-3 px-4">
                                    <h2 className="text-xl font-semibold">Your Links ({PopularLinks.length})</h2>
                                    {PopularLinks.map((link, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                            {link.socialIcon && (
                                                <img
                                                    src={link.socialIcon}
                                                    alt="favicon"
                                                    className="w-8 h-8 flex-shrink-0 rounded"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{link.LinkTitle}</p>
                                                <p className="text-sm text-gray-600 truncate">{link.LinkUrl}</p>
                                            </div>
                                            <button
                                                onClick={() => HandleDeleteLink(index)}
                                                className="text-red-600 hover:text-red-800 transition p-2"
                                                title="Delete link"
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Link Button */}
                            <button
                                onClick={() => setOpen(true)}
                                className="flex gap-1 items-center p-2 px-4 ml-0 sm:ml-5 hover:bg-gray-50 rounded-md transition"
                            >
                                <AddIcon className="text-blue-600" sx={{ fontSize: 28 }} />
                                <p className="text-blue-600 font-medium text-md">
                                    Add link & social icons
                                </p>
                            </button>

                            {/* Add Link Modal */}
                            <BasicModal
                                isOpen={open}
                                onClose={() => setOpen(false)}
                                title="Add your link"
                                size="md"
                            >
                                <div className="flex flex-col gap-3">
                                    <input
                                        className="text-gray-700 p-2 w-full rounded-md border-2 border-gray-200 focus:border-blue-500 outline-none"
                                        placeholder="Link Title"
                                        type="text"
                                        name="LinkTitle"
                                        value={links.LinkTitle}
                                        onChange={HandleChangeLink}
                                    />
                                    <input
                                        className="text-gray-700 p-2 w-full rounded-md border-2 border-gray-200 focus:border-blue-500 outline-none"
                                        placeholder="https://example.com"
                                        type="url"
                                        name="LinkUrl"
                                        value={links.LinkUrl}
                                        onChange={HandleChangeLink}
                                    />
                                    <button
                                        className="bg-blue-600 text-white px-5 py-2 cursor-pointer rounded-md flex items-center gap-2 font-semibold shadow-lg justify-center place-self-end text-base sm:text-lg w-fit hover:bg-blue-700 transition"
                                        onClick={HandleChangePopularLink}
                                    >
                                        Add
                                    </button>
                                </div>
                            </BasicModal>
                        </main>

                        {/* Theme Section */}
                        <div className="flex flex-col gap-5 p-2">
                            <h1 className="text-2xl sm:text-3xl font-semibold pt-3 pl-3">
                                Theme
                            </h1>
                            <div className="gap-5 grid grid-cols-2 sm:grid-cols-3 p-2 lg:w-[70%]">
                                {[
                                    { name: "custom", bg: "bg-white", text: "text-black" },
                                    { name: "lakeWhite", bg: "bg-white", text: "text-black", image: img1 },
                                    { name: "lakeBlack", bg: "bg-black", text: "text-white", image: img2 },
                                    { name: "airSmoke", bg: "bg-neutral-900", text: "text-white", image: img3 },
                                    { name: "airSnow", bg: "bg-gray-100", text: "text-black", image: img4 },
                                    { name: "airGrey", bg: "bg-gray-200", text: "text-black", image: img5 },
                                ].map((themeBtn) => (
                                    <div key={themeBtn.name} className="flex flex-col items-center justify-center gap-1">
                                        <button
                                            onClick={() => setThemeByName(themeBtn.name)}
                                            className={`relative px-2 py-2 rounded-md ${themeBtn.bg} ${themeBtn.text} ${
                                                themeBtn.name === "custom" ? "border-2 border-dashed border-blue-600" : "border border-solid"
                                            } transition hover:opacity-80 w-full overflow-hidden`}
                                        >
                                            {themeBtn.image ? (
                                                <img
                                                    src={themeBtn.image}
                                                    alt={`Theme ${themeBtn.name}`}
                                                    className="w-full h-24 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="h-24 flex items-center justify-center">
                                                    <span className="text-sm">Custom</span>
                                                </div>
                                            )}
                                        </button>
                                        <p className="text-sm font-normal capitalize">{themeBtn.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PREVIEW */}
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
                        <div className="flex flex-col gap-4 items-center justify-center text-center w-full">
                            {/* Profile Image */}
                            <div className="flex gap-3 items-center border-2 border-red-800 h-32 w-32 sm:h-40 sm:w-40 rounded-full overflow-hidden">
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

                            {/* Profile Info */}
                            <h1 className="text-2xl sm:text-3xl font-bold break-words px-2" style={{ color: theme?.titleColor }}>
                                {profile.username || "Input your Name..."}
                            </h1>
                            <p className="text-center text-base sm:text-md font-medium break-words px-3" style={{ color: theme?.bioColor }}>
                                {profile.bio || "Input your Bio..."}
                            </p>

                            {/* Social Icons (First 4 Links Only - NO TITLES) */}
                            {PopularLinks.length > 0 && (
                                <div className="flex gap-3 flex-wrap justify-center py-2">
                                    {PopularLinks.slice(0, 4).map((link, index) => (
                                        <a
                                            key={`icon-${index}`}
                                            href={link.LinkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-lg hover:opacity-80 transition"
                                            style={{
                                                backgroundColor: theme?.linkBackgroundColor || '#f3f4f6',
                                                border: `1px solid ${theme?.linkBorderColor || '#e5e7eb'}`,
                                            }}
                                            title={link.LinkTitle}
                                        >
                                            {link.socialIcon ? (
                                                <img
                                                    src={link.socialIcon}
                                                    alt={link.LinkTitle}
                                                    className="w-10 h-10 rounded"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-300 rounded flex items-center justify-center">
                                                    <span className="text-xs">🔗</span>
                                                </div>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            )}

                            {/* Divider if there are links */}
                            {PopularLinks.length > 0 && (
                                <div className="w-full px-4">
                                    <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: theme?.bioColor || '#666' }}>
                                        Featured Links
                                    </p>
                                </div>
                            )}

                            {/* Full Link Cards (ALL Links with icon, title, and arrow) */}
                            <div className="flex flex-col gap-3 w-full px-2">
                                {PopularLinks.length > 0 ? (
                                    PopularLinks.map((link, index) => (
                                        <a
                                            key={`full-${index}`}
                                            href={link.LinkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between gap-3 p-3 px-4 rounded-full hover:opacity-80 transition group"
                                            style={{
                                                backgroundColor: theme?.linkBackgroundColor || '#f3f4f6',
                                                border: `1px solid ${theme?.linkBorderColor || '#e5e7eb'}`,
                                                color: theme?.linkTextColor || '#000',
                                            }}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                {link.socialIcon ? (
                                                    <img
                                                        src={link.socialIcon}
                                                        alt="favicon"
                                                        className="w-8 h-8 flex-shrink-0 rounded"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 flex-shrink-0 bg-gray-300 rounded flex items-center justify-center">
                                                        <span className="text-xs">🔗</span>
                                                    </div>
                                                )}
                                                <span className="text-base font-medium truncate">{link.LinkTitle}</span>
                                            </div>
                                            <ArrowForwardIcon className="flex-shrink-0 group-hover:translate-x-1 transition-transform" fontSize="small" />
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-sm py-4">No links added yet</p>
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