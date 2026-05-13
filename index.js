require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits, MessageFlags, SlashCommandBuilder, REST, Routes, ChannelType } = require('discord.js');
const fs = require('fs');

const DB_PATH = './boost_config.json';

function lerConfig() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(DB_PATH));
}

function salvarConfig(guildId, data) {
    const configs = lerConfig();
    configs[guildId] = data;
    fs.writeFileSync(DB_PATH, JSON.stringify(configs, null, 4));
}

function obterConfig(guildId) {
    const configs = lerConfig();
    return configs[guildId] || null;
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ]
});

process.on('unhandledRejection', (error) => console.error('❌ Promessa rejeitada não tratada:', error));
process.on('uncaughtException', (error) => console.error('❌ Exceção não capturada:', error));

setInterval(() => {
    console.log('💓 Heartbeat enviado em', new Date().toISOString());
}, 5 * 60 * 1000);

async function enviarMensagemBoost(member) {
    try {
        const config = obterConfig(member.guild.id);
        if (!config || !config.canalBoost || !config.cargoBooster) {
            console.error(`❌ Servidor ${member.guild.name} não está configurado para o bot de Boost.`);
            return false;
        }

        const canalBoost = await member.guild.channels.fetch(config.canalBoost).catch(() => null);
        if (!canalBoost) return false;

        const botMember = canalBoost.guild.members.me;
        const permissoes = canalBoost.permissionsFor(botMember);
        
        if (!permissoes.has(PermissionFlagsBits.SendMessages) || !permissoes.has(PermissionFlagsBits.ViewChannel)) {
            console.error('❌ Bot não tem permissão no canal de boost');
            return false;
        }

        const embed = new EmbedBuilder()
            .setColor('#ff0033') 
            .setTitle('🩸 A ENTIDADE ACEITOU SUA OFERENDA!')
            .setDescription(`A Névoa se torna mais densa e o servidor fica mais forte! Muito obrigado por turbinar a nossa comunidade.\n\n` +
                `**Sua Recompensa de Sangue:**\n` +
                `🦇 Você recebeu o prestigioso cargo de <@&${config.cargoBooster}>!\n\n` +
                `*O seu sacrifício para manter o servidor no topo não será esquecido.*`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setImage('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmdkZ2swZmszbjh6Y3Q2cWZmanlhdWo4YzVuMXEwODEwOXJzMXhxdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mnJN9H87ghKpPMxi1a/giphy.gif')
            .setFooter({ 
                text: 'A Morte não é o refúgio.',
                iconURL: member.guild.iconURL({ dynamic: true }) 
            })
            .setTimestamp();

        await canalBoost.send({ 
            content: `🔥 <@${member.user.id}> acaba de fazer uma oferenda máxima ao servidor!`, 
            embeds: [embed] 
        });
        
        console.log(`✅ Mensagem de boost enviada para ${member.user.tag}`);
        return true;

    } catch (error) {
        console.error('❌ Erro ao enviar mensagem de boost:', error);
        return false;
    }
}

client.once('ready', async () => {
    console.log(`🩸 O Arauto da Entidade despertou como ${client.user.tag}!`);

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    const commands = [
        new SlashCommandBuilder().setName('setup_booster').setDescription('⚙️ [ADMIN] Configura o canal de anúncios e o cargo de Booster')
            .addChannelOption(opt => opt.setName('canal').setDescription('Canal onde a mensagem de boost será enviada').setRequired(true).addChannelTypes(ChannelType.GuildText))
            .addRoleOption(opt => opt.setName('cargo').setDescription('Selecione o cargo. Se deixar em branco, o bot criará um novo!').setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
            
        new SlashCommandBuilder().setName('testar_booster').setDescription('🧪 Testar a mensagem de anúncio de Boost')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ].map(command => command.toJSON());

    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('✅ Comandos slash registrados com sucesso!');
    } catch (error) { 
        console.error('❌ Erro ao registrar comandos:', error); 
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'setup_booster') {
        const canal = interaction.options.getChannel('canal');
        let cargo = interaction.options.getRole('cargo');
        let mensagemResposta = '';

        await interaction.deferReply();

        try {
            if (!cargo) {
                cargo = await interaction.guild.roles.create({
                    name: 'Server Booster',
                    color: '#ff00ff',
                    reason: 'Criação automática para o sistema de anúncios de Boost'
                });
                mensagemResposta = `✅ Configuração concluída!\n\n**Canal de anúncios:** <#${canal.id}>\n**Cargo:** Como você não selecionou um cargo existente, eu criei o <@&${cargo.id}> automaticamente.`;
            } else {
                mensagemResposta = `✅ Configuração concluída!\n\n**Canal de anúncios:** <#${canal.id}>\n**Cargo selecionado:** <@&${cargo.id}>`;
            }

            salvarConfig(interaction.guildId, { canalBoost: canal.id, cargoBooster: cargo.id });
            
            return interaction.editReply(mensagemResposta);
        } catch (error) {
            console.error('Erro no setup do booster:', error);
            return interaction.editReply('❌ Ocorreu um erro na configuração. Verifique as permissões do bot (ele precisa ter permissão de Gerenciar Cargos caso você peça para ele criar um).');
        }
    }

    if (interaction.commandName === 'testar_booster') {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        
        const config = obterConfig(interaction.guildId);
        if (!config || !config.canalBoost) {
            return interaction.editReply('❌ O bot ainda não foi configurado neste servidor. Use o comando **/setup_booster** primeiro!');
        }

        console.log(`🧪 Teste de boost iniciado por ${interaction.user.tag}`);
        
        await enviarMensagemBoost(interaction.member);
        
        return interaction.editReply(`✅ Teste de boost enviado com sucesso para o canal <#${config.canalBoost}>!`);
    }
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const virouBooster = !oldMember.premiumSince && newMember.premiumSince;

    if (virouBooster) {
        console.log(`🎉 ${newMember.user.tag} virou booster no servidor ${newMember.guild.name}! Enviando mensagem...`);
        
        const config = obterConfig(newMember.guild.id);
        if (config && config.cargoBooster) {
            const cargo = newMember.guild.roles.cache.get(config.cargoBooster);
            if (cargo) await newMember.roles.add(cargo).catch(console.error);
        }

        await enviarMensagemBoost(newMember);
    }
});

client.on('error', (error) => console.error('❌ Erro no cliente Discord:', error));
client.on('disconnect', () => console.log('⚠️ Bot desconectado. Tentando reconectar...'));

console.log('⏳ Conectando à Entidade...');
client.login(process.env.TOKEN).catch(error => {
    console.error('❌ Erro ao fazer login:', error);
});