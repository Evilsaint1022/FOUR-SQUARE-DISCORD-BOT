const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;

        const guildName = message.guild.name;
        const guildId = message.guild.id;
        const userId = message.author.id;
        const username = message.author.username;

        // Define directories
        const levelsDir = path.resolve(__dirname, `../../Utilities/Servers/${guildName}_${guildId}/Economy/Levels`);
        const mutedDir = path.resolve(__dirname, `../../Utilities/Servers/${guildName}_${guildId}/Economy/Muted`);
        
        // Change file to store user data in a JSON file named by their username
        const userLevelFilePath = path.join(levelsDir, `${username}.json`);
        const mutedFilePath = path.join(mutedDir, 'muted.json');
        
        // Create directories if they don't exist
        if (!fs.existsSync(levelsDir)) fs.mkdirSync(levelsDir, { recursive: true });
        if (!fs.existsSync(mutedDir)) fs.mkdirSync(mutedDir, { recursive: true });
        
        // Check if user is muted
        let mutedData = {};
        if (fs.existsSync(mutedFilePath)) {
            mutedData = JSON.parse(fs.readFileSync(mutedFilePath, 'utf8'));
        }

        if (mutedData[userId]) {
            return; // User is muted, so don't proceed further
        }

        // Load user level data from their specific JSON file
        let userData = { xp: 0, level: 1 };
        if (fs.existsSync(userLevelFilePath)) {
            userData = JSON.parse(fs.readFileSync(userLevelFilePath, 'utf8'));
        }

        // Generate random XP between 5 and 15
        const xpGain = Math.floor(Math.random() * 11) + 5;
        userData.xp += xpGain;

        // Calculate XP required for the next level (increments of 350 per level)
        const xpForNextLevel = userData.level * 350;

        // Level up if XP threshold is reached
        if (userData.xp >= xpForNextLevel) {
            userData.xp -= xpForNextLevel;
            userData.level += 1;

            message.channel.send(
                `🎉**Congratulations ${message.author}!🎉**\n**You've leveled up to level ${userData.level}!**`
            );
        }

        // Check and update roles for the member (if necessary, this part can be adjusted)
        const currentLevel = userData.level;

        try {
            const userRoles = message.member.roles.cache;

            // You can add custom role management logic here if needed

        } catch (error) {
            console.error(`Failed to update roles for ${message.author.tag}:`, error);
        }

        // Save updated user level data to their respective JSON file
        fs.writeFileSync(userLevelFilePath, JSON.stringify(userData, null, 2));
    },
};
