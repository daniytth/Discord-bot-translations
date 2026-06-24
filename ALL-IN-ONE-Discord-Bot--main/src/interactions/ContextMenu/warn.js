const { CommandInteraction, Client } = require('discord.js');
const { ContextMenuCommandBuilder } = require('discord.js');
const Discord = require('discord.js');

const Schema = require("../../database/models/warnings");
const Case = require("../../database/models/warnCase");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Warn')
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
        if (perms === false) {
            client.errNormal({
                error: `Nincsen elég jogosultságod a parancs végrehajtására!`,
                type: 'ephemeral'
            }, interaction);
            return;
        }

        if (interaction.targetId === interaction.user.id) {
            client.errNormal({
                error: `Nem figyelmezheted magad!`,
                type: 'ephemeral'
            }, interaction);
            return;
        }

        if (interaction.targetUser.bot) {
            client.errNormal({
                error: `Nem figyelmeztethetsz botot!`,
                type: 'ephemeral'
            }, interaction);
            return;
        } 

        if (interaction.targetUser.id === client.user.id) {
            client.errNormal({
                error: `Nem figyelmeztethetsz engem!`,
                type: 'ephemeral'
            }, interaction);
            return;
        }
        
        // Create modal to give a reason
        const modal = new Discord.ModalBuilder()
            .setTitle('Figyelmeztetés')
            .setCustomId('warn')
            .addComponents(
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                        .setCustomId('reason')
                        .setPlaceholder('Indok')
                        .setLabel('Indok')
                        .setMinLength(1)
                        .setStyle(Discord.TextInputStyle.Short)
                        .setMaxLength(100)),
            );
        await interaction.showModal(modal);

        const submitted = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(() => { });

        if (!submitted) {
            return;
        }

        const member = interaction.guild.members.cache.get(interaction.targetId);
        var caseNumber;
        await Case.findOne({ Guild: interaction.guild.id }).then(async data => {
            if (!data) {
                new Case({
                    Guild: interaction.guild.id,
                    Case: 1
                }).save();
                caseNumber = 1;
            }
            else {
                data.Case += 1;
                data.save();
                caseNumber = data.Case;
            }
        });

        Schema.findOne({ Guild: interaction.guild.id, User: member.id }, async (err, data) => {
            if (data) {
                data.Warnings.push({
                    Moderator: interaction.user.id,
                    Reason: submitted.fields.getTextInputValue("reason"),
                    Date: Date.now(),
                    Case: caseNumber
                });
                data.save();
            }
            else {
                new Schema({
                    Guild: interaction.guild.id,
                    User: member.id,
                    Warnings: [{
                        Moderator: interaction.user.id,
                        Reason: submitted.fields.getTextInputValue("reason"),
                        Date: Date.now(),
                        Case: caseNumber
                    }]
                }).save();
            }
        })

        client.embed({
            title: `🔨・Figyelmeztetés`,
            desc: `Figyelmeztetve lettél a(z) **${interaction.guild.name}** szerveren.`,
            fields: [
                {
                    name: "👤┆Moderátor",
                    value: interaction.user.tag,
                    inline: true
                },
                {
                    name: "📄┆Indok",
                    value: submitted.fields.getTextInputValue("reason"),
                    inline: true
                }
            ]
        }, member).catch(() => { })

        client.emit('warnAdd', member, interaction.user, submitted.fields.getTextInputValue("reason"));
        client.succNormal({
            text: `Egy Felhasználó Kapott Egy Figyelmeztetést!`,
            fields: [
                {
                    name: "👤┆Felhasználó",
                    value: `${member}`,
                    inline: true
                },
                {
                    name: "👤┆Moderátor",
                    value: `${interaction.user}`,
                    inline: true
                },
                {
                    name: "📄┆Indok",
                    value: submitted.fields.getTextInputValue("reason"),
                    inline: false
                }
            ],
            type: 'ephemeral'
        }, submitted);
    },
};

