const { Plugin } = require('powercord/entities');
const { get } = require('powercord/http');

module.exports = class sicklyrics extends Plugin {
	startPlugin() {
		powercord.api.commands.registerCommand({
			command: 'lyrics',
			aliases: [ 'l', 'songtext' ],
			description: 'Gets lyrics of the specified song',
			usage: '{c} blah blah [--send]',
			executor: this.lyrics
		});
	}
	async lyrics(args) {
		try {
			let send = false;
			if (args[args.length - 1] === '--send') {
				args.pop();
				send = true;
			}
			const data = await get(
				`https://lyrics-api.powercord.dev/lyrics?input=${encodeURI(args.join(' '))}`
			).then((r) => JSON.parse(r.body.toString()));
			if (!data.data[0].lyrics) {
				return { send: false, result: "I wasn't able to find that song!" };
			}
			const song = data.data[0];
			const resultmsg = `\`\`\`${song.artist} - ${song.name}\n\n${song.lyrics}\n\nLyrics provided by KSoft | © ${song.artist} ${song.album_year}\`\`\``;
			if (resultmsg.length > 2000) {
				resultmsg = song.url;
			}
			return { send: send, result: resultmsg };
		} catch (e) {
			console.log(e);
			return {
				send: false,
				result: `Welp seems like we have an issue, check your dev console (CTRL + SHIFT + I) for more info.`
			};
		}
	}

	pluginWillUnload() {
		powercord.api.commands.unregisterCommand('lyrics');
	}
};
