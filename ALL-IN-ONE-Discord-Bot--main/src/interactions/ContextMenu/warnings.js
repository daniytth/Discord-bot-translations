const { CommandInteraction, Client } = require('discord.js');
const { ContextMenuCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

const Schema = require("../../database/models/warnings");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Figyelmeztetések')
        .setType(2),

    /** 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const perms = await client.checkPerms({
            flags: [Discord.PermissionsBitField.Flags.ManageMessages],
            perms: [Discord.PermissionsBitField.Flags.ManageMessages]
        }, interaction)

        if (perms == false){
            client.errNormal({
                error: "Nincs elég jogosultságod a parancs végrehajtására!",
                type: 'ephemeral'
            }, interaction);
            return;
        }
        await interaction.deferReply({ ephemeral: false });

        const member = interaction.guild.members.cache.get(interaction.targetId);

        Schema.findOne({ Guild: interaction.guild.id, User: member.id }, async (err, data) => {
            if (data) {
                var fields = [];
                data.Warnings.forEach(element => {
                    fields.push({
                        name: "Figyelmeztetés **" + element.Case + "**",
                        value: "Indok: " + element.Reason + "\nModerátor <@!" + element.Moderator + ">",
                        inline: true
                    })
                });
                client.embed({
                    title: `${client.emotes.normal.error}・Figyelmeztetései`,
                    desc: `**${member.user.tag}** figyelmeztetései.`,
                    fields: [
                        {
                            name: "Összesen",
                            value: `${data.Warnings.length}`,
                        },
                        ...fields
                    ],
                    type: 'editreply'
                }, interaction)
            }
            else {
                client.embed({
                    title: `${client.emotes.normal.error}・Figyelmeztetései`,
                    desc: `A(z) ${member.user.tag} felhasználónak nincsen figyelmeztetése!`,
                    type: 'editreply'
                }, interaction)
            }
        })
    },
};

 