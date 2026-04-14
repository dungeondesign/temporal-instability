Hooks.once("ready", () => {

  if (!globalThis.socketlib) {
    console.error("Socketlib not found");
    return;
  }

  game.temporalSocket = socketlib.registerModule("temporal-instability");

  game.temporalSocket.register("showDialog", async () => {

    const actor = game.user.character;
    if (!actor) return;

    new Dialog({
      title: "⏳ Temporal Instability",
      content: `
        <b>Time fractures around you.</b><br><br>
        You feel yourself split between moments.<br><br>
        <i>What do you do?</i>
      `,
      buttons: {

        resist: {
          label: "Anchor Yourself (CON Save)",
          callback: async () => {

            const roll = await new Roll(
              "1d20 + @abilities.con.mod",
              actor.getRollData()
            ).roll({ async: true });

            await roll.toMessage({
              speaker: ChatMessage.getSpeaker({ actor }),
              flavor: "⏳ Resisting Temporal Fracture"
            });

            const success = roll.total >= 13;

            await ChatMessage.create({
              speaker: ChatMessage.getSpeaker({ actor }),
              content: success
                ? `${actor.name} stabilizes their timeline.`
                : `${actor.name} lags behind reality.`
            });
          }
        },

        accept: {
          label: "Let It Happen",
          callback: () => {
            ChatMessage.create({
              speaker: ChatMessage.getSpeaker({ actor }),
              content: `${actor.name} surrenders to the fracture...`
            });
          }
        }

      }
    }).render(true);

  });

});
