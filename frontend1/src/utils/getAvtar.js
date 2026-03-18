export const getAvatar = (user) => {
    const photo = user?.profilePhoto;

    // If photo exists and is NOT the blocked liara.run avatar
    if (photo && photo.startsWith("http") && !photo.includes("liara.run")) {
        return photo;
    }

    const name = user?.fullName || "User";

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&bold=true`;
};