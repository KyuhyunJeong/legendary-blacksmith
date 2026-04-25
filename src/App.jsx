const features = [
  {
    title: 'Forge Loadout',
    description: 'Build weapon sets, tune stats, and compare rarity tiers for each crafted run.',
  },
  {
    title: 'Guild Missions',
    description: 'Track contracts, rotating encounters, and reward milestones from one command board.',
  },
  {
    title: 'Battle Intel',
    description: 'Surface enemy traits, elemental weaknesses, and upgrade paths before the next arena push.',
  },
]

function App() {
  return (
    <div className="app-shell">
      <div className="aurora aurora-left" />
      <div className="aurora aurora-right" />

      <main className="landing">
        <section className="hero-card">
          <p className="eyebrow">Gaming Web App Starter</p>
          <h1>Legendary Blacksmith</h1>
          <p className="hero-copy">
            A bold React starter for a fantasy combat hub. Use it as the base for progression,
            crafting, matchmaking, or live event systems.
          </p>

          <div className="hero-actions">
            <button type="button">Enter the Forge</button>
            <a href="#systems">View Systems</a>
          </div>
        </section>

        <section className="systems" id="systems">
          {features.map((feature) => (
            <article className="system-card" key={feature.title}>
              <span className="system-tag">Core Module</span>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App
