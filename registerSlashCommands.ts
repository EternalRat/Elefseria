require('dotenv').config();
import {
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
} from 'discord.js';
import fs from 'node:fs';

if (!process.env.DISCORD_BOT_TOKEN)
    throw new Error('DISCORD_BOT_TOKEN is not defined in .env');

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

const loadAllSlashCommands = async (path: string) => {
    if (!fs.existsSync(path)) return;
    let commandFiles = await fs.promises.readdir(path);
    for (const file of commandFiles) {
        const lstat = await fs.promises.lstat(`${path}/${file}`);
        if (lstat.isDirectory()) {
            await loadAllSlashCommands(`${path}/${file}`);
            continue;
        }
        const Interaction = await import(`${path}/${file}`);
        for (const kVal in Object.keys(Interaction)) {
            const value = Object.values(Interaction)[kVal];
            try {
                const interaction = new (value as any)();
                commands.push(interaction.getSlashCommandJSON());
            } catch (error) {
                console.error(`No slash command to load at ${path}/${file}`);
            }
        }
    }
};

const deployCommands = async (rest: REST, guildId?: string) => {
    try {
        rest.get(
            Routes.applicationGuildCommands(
                process.env.DISCORD_BOT_APP_ID!,
                guildId!,
            ),
        ).then(async (val) => {
            console.log({ val });
            let registeredCommands: any[] = val as any[];
            registeredCommands = registeredCommands.map((command) => {
                return {
                    options: command.options,
                    name: command.name,
                    description: command.description,
                    default_member_permissions:
                        command.default_member_permissions,
                    nsfw: command.nsfw,
                    id: command.id,
                };
            });

            const toRegister = commands.reduce(
                (allCommands, command) => {
                    console.log(registeredCommands, command);
                    if (
                        !registeredCommands.find(
                            (registeredCommand) =>
                                registeredCommand.name === command.name,
                        )
                    ) {
                        allCommands.toAdd.push(command);
                    } else {
                        if (
                            !registeredCommands.find(
                                (registeredCommand) =>
                                    registeredCommand.name === command.name &&
                                    registeredCommand.description ===
                                        command.description &&
                                    command.options &&
                                    registeredCommand.options &&
                                    registeredCommand.options.length ===
                                        command.options.length &&
                                    command.nsfw === registeredCommand.nsfw &&
                                    command.default_member_permissions ===
                                        registeredCommand.default_member_permissions,
                            )
                        ) {
                            allCommands.toUpdate.push(command);
                        }
                    }
                    return allCommands;
                },
                {
                    toAdd: [] as RESTPostAPIChatInputApplicationCommandsJSONBody[],
                    toUpdate:
                        [] as RESTPostAPIChatInputApplicationCommandsJSONBody[],
                },
            );

            console.info(
                `Started added ${toRegister.toAdd.length} application (/) commands.`,
            );
            // The put method is used to fully refresh all commands in the guild with the current set
            const addedData = (await rest.put(
                guildId
                    ? Routes.applicationGuildCommands(
                          process.env.DISCORD_BOT_APP_ID!,
                          guildId,
                      )
                    : Routes.applicationCommands(
                          process.env.DISCORD_BOT_APP_ID!,
                      ),
                { body: toRegister.toAdd },
            )) as Array<any>;

            console.info(
                `Successfully added ${addedData.length} application (/) commands.`,
            );

            console.info(
                `Started refreshing ${toRegister.toUpdate.length} application (/) commands.`,
            );

            const refreshData = [];
            for (const command of toRegister.toUpdate) {
                const registeredCommand = registeredCommands.find(
                    (registeredCommand) =>
                        registeredCommand.name === command.name,
                );
                if (registeredCommand) {
                    const commandId = registeredCommand.id;
                    const updatedData = (await rest.patch(
                        guildId
                            ? Routes.applicationGuildCommand(
                                  process.env.DISCORD_BOT_APP_ID!,
                                  guildId,
                                  commandId,
                              )
                            : Routes.applicationCommand(
                                  process.env.DISCORD_BOT_APP_ID!,
                                  commandId,
                              ),
                        { body: { ...command, id: commandId } },
                    )) as Array<any>;
                    refreshData.push(updatedData);
                }
            }

            console.info(
                `Successfully refreshed ${refreshData.length} application (/) commands.`,
            );
        });
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
};

// and deploy your commands!
(async () => {
    if (!process.env.DISCORD_BOT_APP_ID)
        throw new Error('DISCORD_BOT_APP_ID is not defined in .env');
    if (!process.env.DISCORD_BOT_GUILD_ID)
        throw new Error('DISCORD_BOT_GUILD_ID is not defined in .env');
    if (!process.env.DISCORD_BOT_PREFIX)
        throw new Error('DISCORD_BOT_PREFIX is not defined in .env');
    if (!process.env.DISCORD_BOT_TOKEN)
        throw new Error('DISCORD_BOT_TOKEN is not defined in .env');
    const rest = new REST({ version: '10' }).setToken(
        process.env.DISCORD_BOT_TOKEN,
    );
    loadAllSlashCommands(__dirname + '/src/interactions/slash')
        .then(() => {
            deployCommands(rest, process.env.DISCORD_BOT_GUILD_ID)
                .then(() => {
                    console.info('Commands have been deployed successfully!');
                })
                .catch((error) => {
                    console.error(error, 'test');
                });
        })
        .catch((error) => {
            console.error(error, 'test2');
        });
})();
