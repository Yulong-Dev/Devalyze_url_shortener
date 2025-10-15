import React, { useState, useContext, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BasicModal from "../components/smoothui/ui/BasicModal.jsx";
import { Themecontext } from "../context/ThemeContext.jsx";
import img1 from "../assets/Frame.svg";
import img2 from "../assets/Frame2.svg";
import img3 from "../assets/Frame3.svg";
import img4 from "../assets/Frame4.svg";
import img5 from "../assets/Frame5.svg";
import { toast } from "react-toastify";
import { savePage, getMyPage, getPageStats } from "../services/pageService.js";
import UsernameInput from "../components/UsernameInput.jsx";
import { Loader } from "lucide-react";
import ShareButton from "../components/ShareButton.jsx";
import imageCompression from "browser-image-compression";
import ImageCropModal from "../components/smoothui/ImageCropModal.jsx";
const STORAGE_KEYS = {
  PROFILE: "devalyze_pages_profile",
  LINKS: "devalyze_pages_links",
  IMAGE: "devalyze_pages_image",
};

function Pages() {
  const { theme, setThemeByName, themeName } = useContext(Themecontext);
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
  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageExists, setPageExists] = useState(false);
  const [pageStats, setPageStats] = useState(null);
  const [shareUrl, setShareUrl] = useState("");
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState(null);

  // Load saved data when component mounts
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      const savedLinks = localStorage.getItem(STORAGE_KEYS.LINKS);
      if (savedLinks) {
        setPopularLinks(JSON.parse(savedLinks));
      }

      const savedImage = localStorage.getItem(STORAGE_KEYS.IMAGE);
      if (savedImage) {
        setGetImage(savedImage);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  // Save profile whenever it changes
  useEffect(() => {
    if (profile.username || profile.bio) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    }
  }, [profile]);

  // Save links whenever they change
  useEffect(() => {
    if (PopularLinks.length > 0) {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(PopularLinks));
    }
  }, [PopularLinks]);

  // Save image whenever it changes
  useEffect(() => {
    if (getImage) {
      localStorage.setItem(STORAGE_KEYS.IMAGE, getImage);
    }
  }, [getImage]);

  // Load from backend when component mounts
  useEffect(() => {
    const loadPageFromBackend = async () => {
      setLoading(true);

      try {
        const data = await getMyPage();

        if (data && data.username) {
          setUsername(data.username);
          setProfile({
            username: data.profileName || "",
            bio: data.bio || "",
          });
          setPopularLinks(data.links || []);
          setGetImage(data.profileImage || null);
          setPageExists(true);

          if (data.theme) {
            setThemeByName(data.theme);
          }

          const url = `${window.location.origin}/u/${data.username}`;
          setShareUrl(url);

          const stats = await getPageStats();
          if (stats.exists) {
            setPageStats(stats.stats);
          }
        } else {
          setPageExists(false);
        }
      } catch (error) {
        console.error("Error loading page:", error);
        toast.error("Failed to load page data");
      } finally {
        setLoading(false);
      }
    };

    loadPageFromBackend();
  }, []);

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
      const url = new URL(
        links.LinkUrl.startsWith("http")
          ? links.LinkUrl
          : `https://${links.LinkUrl}`
      );
      const domain = url.hostname;
      const iconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

      setPopularLinks((prev) => [...prev, { ...links, socialIcon: iconUrl }]);
    } catch (error) {
      setPopularLinks((prev) => [...prev, { ...links, socialIcon: "" }]);
    }

    setLinks({ LinkTitle: "", LinkUrl: "", socialIcon: "" });
    setOpen(false);
  };

  const HandleDeleteLink = (index) => {
    setPopularLinks((prev) => prev.filter((_, i) => i !== index));
  };

  async function handleGetImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 2, // Increase for cropping
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onload = (event) => {
        setTempImage(event.target.result);
        setCropModalOpen(true); // Open crop modal
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Image compression failed:", error);
      toast.error("Failed to process image. Please try again.");
    }
  }
  const handleCropComplete = (croppedImage) => {
    setGetImage(croppedImage);
    setTempImage(null);
    toast.success("✂️ Image cropped successfully!");
  };

  function RemoveImages() {
    setGetImage(null);
  }

  const handleSaveToBackend = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    if (!usernameValid) {
      toast.error("Username is not available or invalid");
      return;
    }

    if (!profile.username.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setSaving(true);

    try {
      const pageData = {
        username: username.toLowerCase().trim(),
        profileName: profile.username,
        bio: profile.bio,
        profileImage: getImage || "",
        theme: themeName || "lakeWhite",
        links: PopularLinks.map((link, index) => ({
          ...link,
          order: index,
        })),
      };

      const response = await savePage(pageData);

      const url = `${window.location.origin}/u/${username}`;
      setShareUrl(url);
      setPageExists(true);

      toast.success(
        pageExists
          ? "✅ Page updated successfully!"
          : "🎉 Page created successfully!"
      );

      const stats = await getPageStats();
      if (stats.exists) {
        setPageStats(stats.stats);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!shareUrl) {
      toast.error("Save your page first to get a shareable link");
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("🔗 Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  function clearAllData() {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This cannot be undone."
      )
    ) {
      setProfile({ username: "", bio: "" });
      setPopularLinks([]);
      setGetImage(null);

      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.LINKS);
      localStorage.removeItem(STORAGE_KEYS.IMAGE);

      toast.success("🗑️ All data cleared!");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4 md:p-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-600">Loading your page...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <nav className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Create Your Page
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Build your personal link-in-bio page
            </p>
          </nav>

          <div className="flex flex-col lg:flex-row gap-4 md:gap-6 p-4 sm:p-6">
            {/* LEFT: MAIN FORM */}
            <div className="flex-1 lg:flex-[2] space-y-6">
              {/* Profile Image Upload */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-blue-100 overflow-hidden bg-white shadow-lg">
                      {getImage ? (
                        <img
                          src={getImage}
                          alt="Profile"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm p-4 text-center">
                          No image
                        </div>
                      )}
                    </div>
                    <ImageCropModal
                      open={cropModalOpen}
                      onClose={() => {
                        setCropModalOpen(false);
                        setTempImage(null);
                      }}
                      imageSrc={tempImage}
                      onCropComplete={handleCropComplete}
                    />
                  </div>

                  <div className="flex flex-col gap-3 w-full ">
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleGetImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="fileInput"
                      className="bg-blue-600 text-white px-6 py-3 cursor-pointer rounded-lg font-semibold shadow-md hover:bg-blue-700 transition text-center"
                    >
                      📷 Pick an Image
                    </label>

                    {getImage && (
                      <button
                        onClick={RemoveImages}
                        className="border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-gray-700"
                      >
                        🗑️ Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Profile Information</h2>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
                    value={profile.username}
                    onChange={HandleChange}
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <UsernameInput
                    value={username}
                    onChange={setUsername}
                    onValidChange={setUsernameValid}
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <input
                    type="text"
                    placeholder="Tell people about yourself..."
                    name="bio"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-white"
                    value={profile.bio}
                    onChange={HandleChange}
                  />
                </div>
              </div>

              {/* Links Section */}
              {PopularLinks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      Your Links ({PopularLinks.length})
                    </h2>
                  </div>
                  <div className="space-y-2">
                    {PopularLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg bg-white hover:border-blue-300 hover:shadow-sm transition group"
                      >
                        {link.socialIcon && (
                          <img
                            src={link.socialIcon}
                            alt="icon"
                            className="w-10 h-10 flex-shrink-0 rounded-lg"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {link.LinkTitle}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {link.LinkUrl}
                          </p>
                        </div>
                        <button
                          onClick={() => HandleDeleteLink(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition flex-shrink-0"
                          title="Delete link"
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 bg-blue-50 rounded-lg p-4 border border-blue-100">
                <button
                  onClick={handleSaveToBackend}
                  disabled={saving || !usernameValid}
                  className={`w-full px-6 py-4 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 text-lg ${
                    saving || !usernameValid
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {saving ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>{pageExists ? "💾 Update Page" : "🚀 Save & Publish"}</>
                  )}
                </button>

                <button
                  onClick={() => setOpen(true)}
                  className="w-full flex gap-2 items-center justify-center p-3 hover:bg-white rounded-lg transition font-medium text-blue-600"
                >
                  <AddIcon sx={{ fontSize: 24 }} />
                  <span>Add Link</span>
                </button>

                {(PopularLinks.length > 0 ||
                  profile.username ||
                  profile.bio ||
                  getImage) && (
                  <button
                    onClick={clearAllData}
                    className="w-full flex gap-2 items-center justify-center p-3 hover:bg-red-50 rounded-lg transition font-medium text-red-600"
                  >
                    <DeleteIcon sx={{ fontSize: 20 }} />
                    <span>Clear All Data</span>
                  </button>
                )}
              </div>

              {/* Theme Selection */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Choose Theme</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {[
                    { name: "custom", bg: "bg-white", text: "text-black" },
                    {
                      name: "lakeWhite",
                      bg: "bg-white",
                      text: "text-black",
                      image: img1,
                    },
                    {
                      name: "lakeBlack",
                      bg: "bg-black",
                      text: "text-white",
                      image: img2,
                    },
                    {
                      name: "airSmoke",
                      bg: "bg-neutral-900",
                      text: "text-white",
                      image: img3,
                    },
                    {
                      name: "airSnow",
                      bg: "bg-gray-100",
                      text: "text-black",
                      image: img4,
                    },
                    {
                      name: "airGrey",
                      bg: "bg-gray-200",
                      text: "text-black",
                      image: img5,
                    },
                  ].map((themeBtn) => (
                    <button
                      key={themeBtn.name}
                      onClick={() => setThemeByName(themeBtn.name)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                        themeName === themeBtn.name
                          ? "border-blue-600 ring-4 ring-blue-100"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {themeBtn.image ? (
                        <img
                          src={themeBtn.image}
                          alt={themeBtn.name}
                          className="w-full h-24 sm:h-28 object-cover"
                        />
                      ) : (
                        <div className="w-full h-24 sm:h-28 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                          <span className="text-sm font-medium">Custom</span>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm font-medium capitalize py-2 bg-white">
                        {themeBtn.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: PREVIEW */}
            <aside className="lg:flex-[1] lg:sticky lg:top-6 lg:self-start">
              <div className="bg-gray-100 rounded-lg p-4 sm:p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-4 text-center">
                  LIVE PREVIEW
                </h3>
                <div
                  className="rounded-xl p-6 shadow-xl max-w-md mx-auto"
                  style={{
                    backgroundColor: theme?.backgroundColor || "#fff",
                    color: theme?.titleColor || "#000",
                    border: theme?.border || "1px solid #e5e7eb",
                    boxShadow: theme?.boxShadow,
                    backdropFilter: theme?.backdropFilter,
                  }}
                >
                  <div className="flex flex-col gap-4 items-center text-center">
                    {/* Profile Image */}
                    <div className="w-28 h-28 rounded-full border-4 border-red-500 overflow-hidden bg-white shadow-lg">
                      {getImage ? (
                        <img
                          src={getImage}
                          alt="Preview"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <h1
                      className="text-2xl font-bold break-words"
                      style={{ color: theme?.titleColor }}
                    >
                      {profile.username || "Your Name"}
                    </h1>
                    <p
                      className="text-sm break-words"
                      style={{ color: theme?.bioColor }}
                    >
                      {profile.bio || "Your bio goes here..."}
                    </p>

                    {/* Social Icons */}
                    {PopularLinks.length > 0 && (
                      <div className="flex gap-2 flex-wrap justify-center py-2">
                        {PopularLinks.slice(0, 4).map((link, index) => (
                          <div
                            key={`icon-${index}`}
                            className="p-2 rounded-lg"
                            style={{
                              backgroundColor:
                                theme?.linkBackgroundColor || "#f3f4f6",
                              border: `1px solid ${
                                theme?.linkBorderColor || "#e5e7eb"
                              }`,
                            }}
                          >
                            {link.socialIcon ? (
                              <img
                                src={link.socialIcon}
                                alt={link.LinkTitle}
                                className="w-8 h-8 rounded"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-xs">
                                🔗
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Link Cards */}
                    <div className="w-full space-y-2 mt-2">
                      {PopularLinks.length > 0 ? (
                        PopularLinks.map((link, index) => (
                          <div
                            key={`full-${index}`}
                            className="flex items-center justify-between gap-3 p-3 rounded-full"
                            style={{
                              backgroundColor:
                                theme?.linkBackgroundColor || "#f3f4f6",
                              border: `1px solid ${
                                theme?.linkBorderColor || "#e5e7eb"
                              }`,
                              color: theme?.linkTextColor || "#000",
                            }}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {link.socialIcon && (
                                <img
                                  src={link.socialIcon}
                                  alt=""
                                  className="w-6 h-6 rounded"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              )}
                              <span className="text-sm font-medium truncate">
                                {link.LinkTitle}
                              </span>
                            </div>
                            <ArrowForwardIcon fontSize="small" />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-xs py-4">
                          Add links to see them here
                        </p>
                      )}
                    </div>

                    {shareUrl && (
                      <button
                        onClick={handleCopyUrl}
                        className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition text-sm mt-2"
                      >
                        📋 Copy Link
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Footer Stats & Share */}
          {(shareUrl || pageStats) && (
            <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
              {shareUrl && <ShareButton username={username} url={shareUrl} />}

              {pageStats && (
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                  <span className="flex items-center gap-1">
                    👀 <strong>{pageStats.totalViews}</strong> views
                  </span>
                  <span className="flex items-center gap-1">
                    🔗 <strong>{pageStats.totalLinks}</strong> links
                  </span>
                  <span className="flex items-center gap-1 text-green-600">
                    ✅ Published
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add Link Modal */}
      <BasicModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Add New Link"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Title
            </label>
            <input
              className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="e.g., My Portfolio"
              type="text"
              name="LinkTitle"
              value={links.LinkTitle}
              onChange={HandleChangeLink}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="https://example.com"
              type="url"
              name="LinkUrl"
              value={links.LinkUrl}
              onChange={HandleChangeLink}
            />
          </div>
          <button
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
            onClick={HandleChangePopularLink}
          >
            ➕ Add Link
          </button>
        </div>
      </BasicModal>
    </div>
  );
}

export default Pages;
