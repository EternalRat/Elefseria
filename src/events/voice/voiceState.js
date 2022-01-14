// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
const { Client, VoiceState } = require('discord.js');
const BaseEvent = require('../../utils/structures/BaseEvent');
const Voice = require('../../class/VoiceClass');

module.exports = class voiceChannelManager extends BaseEvent {
  constructor() {
    super('voiceStateUpdate');
  }
  
  /**
   * 
   * @param {Client} client 
   * @param {VoiceState} oldState 
   * @param {VoiceState} newState 
   */
  async run(client, oldState, newState) {
		if (newState.member.user.bot) return;
    const voice = new Voice(client, oldState, newState);
    await voice.voiceManager();
    voice.logs();
  }
}