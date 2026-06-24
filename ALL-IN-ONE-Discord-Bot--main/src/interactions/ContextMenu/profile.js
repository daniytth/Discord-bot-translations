const { CommandInteraction, Client } = require('discord.js');
const { ContextMenuCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

const model = require('../../database/models/badge');
const Schema = require('../../database/models/profile');
const CreditsSchema = require("../../database/models/votecredits");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Bot profile')
        .setType(2),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */

    run: async (client, interaction, args) => {
        const badgeFlags = {
            DEVELOPER: client.emotes.badges.developer,
            EVENT: client.emotes.badges.event,
            BOOSTER: client.emotes.badges.booster,
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
            MARKETING: client.emotes.badges.marketing,
            ACTIVE: client.emotes.badges.active,
            VIP: client.emotes.badges.vip
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


        const user = interaction.guild.members.cache.get(interaction.targetId);

        Schema.findOne({ User: user.id }, async (err, data) => {
            if (data) {
                await interaction.deferReply({ fetchReply: true });
                let Badges = await model.findOne({ User: user.id });

                let credits = 0;
                const creditData = await CreditsSchema.findOne({ User: user.id });

                if (Badges && Badges.FLAGS.includes("DEVELOPER")) {
                    credits = "∞";
                }
                else if (creditData) {
                    credits = creditData.Credits;
                }

                if (!Badges) Badges = { User: user.id };

                const userFlags = user.flags ? user.flags.toArray() : [];

                client.embed({
                    title: `${client.user.username}・Profilja`,
                    desc: '_____',
                    thumbnail: user.avatarURL({ dynamic: true }),
                    fields: [
                    {
                        name: "👨‍👩‍👦┆Neme",
                        value: `${data.Gender || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "🔢┆Életkor",
                        value: `${data.Age || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "🎂┆Születésnap",
                        value: `${data.Birthday || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "🎨┆Kedvenc Szín",
                        value: `${data.Color || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "🐶┆Kedvenc Háziállatok",
                        value: `${data.Pets.join(', ') || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "🍕┆Kedvenc Kaja",
                        value: `${data.Food.join(', ') || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "🎶┆Kedvenc Zene",
                        value: `${data.Songs.join(', ') || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "🎤┆Kedvenc Zeneszerző",
                        value: `${data.Artists.join(', ') || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "🎬┆Kedvenc Filmek",
                        value: `${data.Movies.join(', ') || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "👨‍🎤┆Kedvenc Szereplő",
                        value: `${data.Actors.join(', ') || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "🏴┆Eredet",
                        value: `${data.Orgin || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "🎮┆Hobbik",
                        value: `${data.Hobbys.join(', ') || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "😛┆Státusz",
                        value: `${data.Status || 'Nincsen beállítva.'}`,
                        inline: true
                    },
                    {
                        name: "📛┆Bot Jelvények",
                        value: `${Badges.FLAGS ? Badges.FLAGS.map(flag => badgeFlags[flag]).join(' ') : 'Semmmi'}`,
                        inline: true
                    },
                    {
                        name: "🏷️┆Discord Jelvények",
                        value: `${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'Semmmi' || 'Semmmi'}`,
                        inline: true
                    },
                    {
                        name: "💳┆Dcredits",
                        value: `${credits || 'Semmmi'}`,
                        inline: true
                    },
                    {
                        name: "ℹ️┆Rólam",
                        value: `${data.Aboutme || 'Nincsen beállítva.'}`,
                        inline: false
                    },], type: 'editreply'
                }, interaction);
            }
            else {
                return client.errNormal({ error: "Nem találtam profilt! Nyiss profilt a /profile create paranccsal!", type: 'ephemeral' }, interaction);
            }
        })
    },
};

 