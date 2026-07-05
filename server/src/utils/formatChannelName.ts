const formatChannelName = (name: string): string => {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
};

export default formatChannelName;