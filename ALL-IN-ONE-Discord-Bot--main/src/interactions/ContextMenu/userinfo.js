const { CommandInteraction, Client } = require('discord.js');
const { ContextMenuCommandBuilder } = require('discord.js');
const Discord = require('discord.js');
const axios = require("axios");

const model = require('../../database/models/badge');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Userinfo')
        .setType(2),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        await interaction.deferReply({ ephemeral: false });
        const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
        if (!member) return client.errNormal({
            error: "Ez a felhasználó nem tagja ennek a szervernek!",
            type: 'editreply'
        }, interaction);
        const badgeFlags = {
            DEVELOPER: client.emotes.badges.developer,
            BUGS: client.emotes.badges.bug,
            MANAGEMENT: client.emotes.badges.management,
            PREMIUM: client.emotes.badges.premium,
            SUPPORTER: client.emotes.badges.supporter,
            TEAM: client.emotes.badges.team,
            BOOSTER: client.emotes.badges.booster,
            PARTNER: client.emotes.badges.partner,
            VOTER: client.emotes.badges.voter,
            SUPPORT: client.emotes.badges.support,
            MODERATOR: client.emotes.badges.moderator,
            DESIGNER: client.emotes.badges.designer,
            MARKETING: client.emotes.badges.marketing
        }

        const flags = {
            ActiveDeveloper: "👨‍💻・Aktív Fejlesztő",
            BugHunterLevel1: "🐛・Discord Bug Kereső",
            BugHunterLevel2: "🐛・Discord Bug Kereső",
            CertifiedModerator: "👮‍♂️・Hítelesített Moderátor",
            HypeSquadOnlineHouse1: "🏠・House Bravery Member",
            HypeSquadOnlineHouse2: "🏠・House Brilliance Member",
            HypeSquadOnlineHouse3: "🏠・House Balance Member",
            HypeSquadEvents: "🏠・HypeSquad Események",
            PremiumEarlySupporter: "👑・Korai Támogató",
            Partner: "👑・Partner",
            Quarantined: "🔒・Karaténozótt", // Not sure if this is still a thing
            Spammer: "🔒・Spammer", // Not sure if this one works
            Staff: "👨‍💼・A Discord Személyzete",
            TeamPseudoUser: "👨‍💼・Discord Csapata",
            VerifiedBot: "🤖・Hítelesített Alkamazás",
            VerifiedDeveloper: "👨‍💻・Korai Hítelesített Bot Fejlesztő",
        }

        let Badges = await model.findOne({ User: member.user.id });
        if (!Badges) Badges = { User: member.user.id }
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);
        const userFlags = member.user.flags ? member.user.flags.toArray() : [];

        return client.embed({
            title: `👤・Felhasználó Információ`,
            desc: `Információ róla: ${member.user.username}`,
            thumbnail: member.user.displayAvatarURL({ dynamic: true, size: 1024 }),
            image: member.user.bannerURL({ dynamic: true, size: 1024 }),
            fields: [
                {
                    name: "Felhasználó",
                    value: `${member.user.username}`,
                    inline: true,
                },
                {
                    name: "Discriminator",
                    value: `${member.user.discriminator}`,
                    inline: true,
                },
                {
                    name: "Becenév",
                    value: `${member.nickname || 'Nincsen becenév.'}`,
                    inline: true,
                },
                {
                    name: "ID",
                    value: `${member.user.id}`,
                    inline: true,
                },
                {
                    name: "Zászlódísz",
                    value: `${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'Semmi'}`,
                    inline: true,
                },
                {
                    name: "Jelvények",
                    value: `${Badges.FLAGS ? Badges.FLAGS.map(flag => badgeFlags[flag]).join(' ') : 'Semmi'}`,
                    inline: true,
                },
                {
                    name: "Discordhoz Csatlakozás",
                    value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>`,
                    inline: true,
                },
                {
                    name: "Csatlakozott a Szerverre",
                    value: `<t:${Math.round(member.joinedAt / 1000)}>`,
                    inline: true,
                },
                {
                    name: `Rangok [${roles.length}]`,
                    value: `${roles.length ? roles.join(', ') : 'Semmi'}`,
                    inline: false,
                }
            ],
            type: 'editreply'
        }, interaction)
    },
};

 