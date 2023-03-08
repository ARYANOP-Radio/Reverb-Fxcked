const Command = require('../../structures/Command');
            
module.exports = class Broadcast extends Command {
    constructor(client) {
        super(client, {
            name: 'broadcast',
            description: {
                content: 'Broadcasts a message to all shards.',
                usage: '<message>',
                examples: ['Hello!'],
            },
            aliases: ['bc'],
            permissions: {
                dev: true,
            },
        });
    }
    async run(client, message, args) {
        const shard = args[0];
        await client.cluster.broadcastEval(broadcastMessage, { context: { message: shard } });
        await message.reply(`Broadcasted \`${shard}\` to all shards.`);
        async function broadcastMessage(c, { message }) {
            if (c.cluster.id.includes(Number(message))) {
                const { ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
                const guilds = c.guilds.cache.map(guild => guild.id);
                const channelNames = [
                    'bot-commands',
                    'commands',
                    'bot',
                    'bots',
                    'command',
                    'music-commands',
                    'cmds',
                    'bot-cmds',
                    'music-cmds',
                    '명령어',
                    '봇',
                    'команды',
                    'боты',
                    'ear',
                    'botum',
                    'music',
                    'general',
                    'chat',
                    'talk',
                ];

                const channelNamesNotToUse = [
                    'information',
                    'rules',
                    'announcements',
                    'faq',
                    'rules-and-info',
                    'welcome',
                    'welcome-and-rules',
                    'welcome-rules',
                ];

                for (let i = 0; i < guilds.length; i++) {
                    const delay = ms => new Promise(res => setTimeout(res, ms));
                    await delay(1000);

                    const guild = c.guilds.cache.get(guilds[i]);
                    try {
                        const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).filter(ch => ch.permissionsFor(c.user).has(PermissionsBitField.Flags.ViewChannel));

                        let channel;
                        let found = false;
                        for (let j = 0; j < channelNames.length; j++) {
                            for (let m = 0; m < channels.size; m++) {
                                if (channels.at(m).name.includes(channelNames[j])) {
                                    channel = channels.at(m);
                                    found = true;
                                    break;
                                }
                            }
                            if (found) break;
                        }

                        const title = '**Normal Commands No Longer Working**';
                        const content = `
                        As of September 1st, Discord has removed the message content privelage from **MoE** and many other bots. This is not something I had a say in or wanted.
                                
                        From now on the bot will only work through slash commands and mentions. Instead of typing \`?play\` , type ${c.config.cmdId.play}, ${c.config.cmdId.skip}, instead. If slash commands aren't working or appearing for you, join the support server.
                                
                        Thank you for using MoE.
                                
                        TLDR: Use \`/\`instead of \`?\` before each command. E.g: ${c.config.cmdId.play}, ${c.config.cmdId.skip}\n\n **and if you feel buggy voice than please use** \`/fixvoice\` command`;

                        const infoButtonRow = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel('Slash Command FAQ')
                                    .setURL('https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ'),
                                new ButtonBuilder()
                                    .setLabel('Support Server')
                                    .setStyle(ButtonStyle.Link)
                                    .setURL(c.config.links.server),
                                new ButtonBuilder()
                                    .setStyle(ButtonStyle.Link)
                                    .setLabel('Google Translate')
                                    .setURL('https://translate.google.com'));

                        const embed = new EmbedBuilder()
                            .setColor(c.config.color)
                            .setTitle(title.replaceAll('\n', ''))
                            .setDescription(content)
                            .setTimestamp()
                            //.setImage('https://cdn.discordapp.com/attachments/689277002988912661/1016478133291069470/ezgif-5-e5b1863bc4.gif')
                            .setFooter({ text: guild.name, iconURL: guild.iconURL() });

                        if (channel && channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages) && channel.type == ChannelType.GuildText) {
                            if (channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.EmbedLinks)) {
                                await channel.send({ embeds: [embed], components: [infoButtonRow] }).then(() => {
                                    c.logger.success(`Sent broadcast message to ${guild.id} in ${channel.id} on Shard ${c.cluster.ids}.`);
                                }).catch((e) => {
                                    c.logger.error(`Failed to send broadcast message to ${guild.id} in ${channel.id} on Shard ${c.cluster.ids}.\nError: ${e}`);
                                });
                            }
                            else {
                                await channel.send({ content: title + content }).then(() => {
                                    c.logger.success(`Sent broadcast message to ${guild.id} in ${channel.id} on Shard ${c.cluster.ids}.`);
                                }).catch((e) => {
                                    c.logger.error(`Failed to send broadcast message to ${guild.id} in ${channel.id} on Shard ${c.cluster.ids}.\nError: ${e}`);
                                });
                            }
                        }
                        else {
                            for (let n = 0; n < channels.size; n++) {
                                const fChannel = channels.at(n);
                                if (!channelNamesNotToUse.includes(fChannel) && fChannel.type == ChannelType.GuildText && fChannel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages)) {
                                    if (fChannel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.EmbedLinks)) {
                                        await fChannel.send({ embeds: [embed], components: [infoButtonRow, languageButtonRow] }).then(() => {
                                            c.logger.success(`Sent broadcast message to ${guild.id} in ${fChannel.id} on Shard ${c.cluster.ids}.`);
                                        }).catch((e) => {
                                            c.logger.error(`Failed to send broadcast message to ${guild.id} in ${fChannel.id} on Shard ${c.cluster.ids}.\nError: ${e}`);
                                        });
                                        break;
                                    }
                                    else {
                                        await fChannel.send({ content: title + content }).then(() => {
                                            c.logger.success(`Sent broadcast message to ${guild.id} in ${fChannel.id} on Shard ${c.cluster.ids}.`);
                                        }).catch((e) => {
                                            c.logger.error(`Failed to send broadcast message to ${guild.id} in ${fChannel.id} on Shard ${c.cluster.ids}.\nError: ${e}`);
                                        });
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    catch (error) {
                        c.logger.error(`Failed to send broadcast message to ${guild.id} on Shard ${c.cluster.ids}.\nError: ${error}`);
                    }
                }
            }
        }
    }
}