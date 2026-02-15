import Command from "../../structures/Command.js";
import { ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SeparatorSpacingSize } from "discord.js";
import { getEmoji } from "../../utils/emoji.js";
import { resolveColor } from "../../utils/resolveColor.js";
import { formatNumber } from "../../utils/formatters.js";

export default class MemberCount extends Command {
    constructor(client) {
        super(client, {
            name: 'membercount',
            description: {
                content: 'Display the server member count',
                usage: '',
                examples: ['membercount'],
            },
            aliases: ['mc', 'members'],
            category: 'utility',
            cooldown: 5,
            permissions: {
                dev: false,
                client: ['SendMessages', 'ViewChannel', 'EmbedLinks'],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    async run(ctx) {
        const guild = ctx.guild;
        const total = guild.memberCount;
        const humans = guild.members.cache.filter(m => !m.user.bot).size;
        const bots = guild.members.cache.filter(m => m.user.bot).size;
        const online = guild.members.cache.filter(m => m.presence?.status === 'online').size;
        const idle = guild.members.cache.filter(m => m.presence?.status === 'idle').size;
        const dnd = guild.members.cache.filter(m => m.presence?.status === 'dnd').size;
        const offline = total - online - idle - dnd;

        const embed = this.client.embed()
            .setColor(this.client.color.default)
            .setTitle(`${getEmoji('members', '👥')} Member Count`)
            .addFields(
                { name: `${getEmoji('members', '👥')} Total`, value: formatNumber(total), inline: true },
                { name: `${getEmoji('member', '👤')} Humans`, value: formatNumber(humans), inline: true },
                { name: `${getEmoji('bot', '🤖')} Bots`, value: formatNumber(bots), inline: true },
                { name: `${getEmoji('online', '🟢')} Online`, value: formatNumber(online), inline: true },
                { name: `${getEmoji('idle', '🌙')} Idle`, value: formatNumber(idle), inline: true },
                { name: `${getEmoji('dnd', '🔴')} DND`, value: formatNumber(dnd), inline: true },
            )
            .setTimestamp();

        const container = new ContainerBuilder()
            .setAccentColor(resolveColor(this.client.color.default))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`# ${getEmoji('members', '👥')} Member Count`),
            )
            .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small))
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`${getEmoji('members', '👥')} **Total:** ${formatNumber(total)}`),
                new TextDisplayBuilder().setContent(`${getEmoji('member', '👤')} **Humans:** ${formatNumber(humans)}`),
                new TextDisplayBuilder().setContent(`${getEmoji('bot', '🤖')} **Bots:** ${formatNumber(bots)}`),
                new TextDisplayBuilder().setContent(`\u200b`),
                new TextDisplayBuilder().setContent(`${getEmoji('online', '🟢')} Online: ${formatNumber(online)} • ${getEmoji('idle', '🌙')} Idle: ${formatNumber(idle)} • ${getEmoji('dnd', '🔴')} DND: ${formatNumber(dnd)}`),
            );

        const message = [
            `${getEmoji('members', '👥')} **Member Count**`,
            `**Total:** ${formatNumber(total)} • **Humans:** ${formatNumber(humans)} • **Bots:** ${formatNumber(bots)}`,
            `${getEmoji('online', '🟢')} ${formatNumber(online)} • ${getEmoji('idle', '🌙')} ${formatNumber(idle)} • ${getEmoji('dnd', '🔴')} ${formatNumber(dnd)}`,
        ].join('\n');

        return ctx.sendTypedMessage({ embed, componentsv2: [container], message });
    }
}
