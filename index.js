const { Client, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require('discord.js');
const axios = require('axios');
const env = require('dotenv');
env.config();

const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}`;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ],
});

client.once('ready', () => {
    console.log('ready');
});

client.on('guildMemberAdd', member => {
    console.log(`${member.user.username} is connected`);
});

client.on('messageCreate', message => {
    if (message.author.bot) return;
    console.log(message.author)
    message.reply({ content: "Hello!!!" });
    message.reply({ content: "I can provide today's top headlines" });
    message.reply({ content: "You can write '/news' to get news headlines" });
});

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand() && interaction.commandName === 'news') {
        const hindustanTimes = new ButtonBuilder()
            .setLabel('Hindustan Times')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('hindustan-times');

        const timesOfIndia = new ButtonBuilder()
            .setLabel('The Times of India')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('times-of-india');

        const ndtv = new ButtonBuilder()
            .setLabel('NDTV News')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('ndtv-news');

        const buttonRow = new ActionRowBuilder().addComponents(hindustanTimes, timesOfIndia, ndtv);
        const reply = await interaction.reply({ content: 'Choose a news channel', components: [buttonRow] });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
        });

        collector.on('collect', async i => {
            try {
                const response = await axios.get(url);
                if (response.data.status === 'ok') {
                    const articles = response.data.articles.filter(article => {
                        switch (i.customId) {
                            case 'hindustan-times':
                                return article.source.name.includes('Hindustan Times');
                            case 'times-of-india':
                                return article.source.name.includes('Times of India');
                            case 'ndtv-news':
                                return article.source.name.includes('NDTV');
                            default:
                                return false;
                        }
                    });

                    if (articles.length > 0) {
                        const newsContent = articles.map(article => 
                            `**Title**: ${article.title}\n**Description**: ${article.description}\n**Link**: ${article.url}\n`
                        ).join('\n');

                        i.reply({ content: newsContent });
                    } else {
                        i.reply({ content: 'No articles found for the selected source.' });
                    }
                } else {
                    i.reply({ content: 'Error fetching news from API' });
                }
            } catch (error) {
                console.error('Error fetching news:', error);
                i.reply({ content: 'Error fetching news' });
            }
        });
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);