export function WorksheetArt({
  variant = "farm",
  mini = false,
}: {
  variant?: string;
  mini?: boolean;
}) {
  const ocean = variant === "ocean",
    alphabet = variant === "alphabet",
    dino = variant === "dinosaurs",
    space = variant === "space",
    fruits = variant === "fruits",
    shapes = variant === "shapes",
    numbers = variant === "numbers";
  const title = ocean
    ? "Teman bawah laut"
    : alphabet
      ? "Ayo menulis huruf!"
      : dino
        ? "Dunia dinosaurus"
        : space
          ? "Misi menuju bulan"
          : fruits
            ? "Fruits & words"
            : shapes
              ? "Bermain bentuk"
              : numbers
                ? "Ayo tambah angka!"
                : "Ayo berhitung!";
  const instruction = ocean
    ? "Hubungkan teman yang sama, yuk!"
    : alphabet
      ? "Ikuti garisnya, tulis hurufnya."
      : dino
        ? "Warnai teman barumu, yuk!"
        : space
          ? "Bantu roket sampai ke bulan."
          : fruits
            ? "Match each fruit to its word."
            : shapes
              ? "Lingkari bentuk yang sama."
              : numbers
                ? "Hitung dan isi kotak kosong."
                : "Hitung hewannya, lingkari angkanya.";
  return (
    <div
      className={`worksheet-art ${mini ? "mini" : ""} ${variant}`}
      aria-label={`Ilustrasi contoh: ${title}`}
      role="img"
    >
      <div aria-hidden="true">
        <div className="sheet-top">
          <span>LEMBAR BELAJAR SERU</span>
          <span>✦</span>
        </div>
        <h3>{title}</h3>
        <p className="sheet-instruction">{instruction}</p>
        <div className="sheet-divider" />
        {space ? (
          <div className="maze-preview">
            <span>🚀</span>
            <svg viewBox="0 0 180 150" fill="none">
              <path
                d="M8 8H172V142H8V28M8 48H48V8M48 48H88V28H132V68H172M8 78H68V108H38V142M98 48V98H132V142M98 118V142M38 108V98M132 98H152"
                stroke="#b1a2c9"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
            <span>🌙</span>
          </div>
        ) : (
          [0, 1, 2].map((row) => (
            <div key={row} className="worksheet-row">
              <span className="row-number">{row + 1}</span>
              {alphabet ? (
                <span className="tracing-letters">
                  {["A a A a", "B b B b", "C c C c"][row]}
                </span>
              ) : dino ? (
                <span className="dino-outline">{["🦕", "🦖", "🦕"][row]}</span>
              ) : ocean ? (
                <div className="matching-preview">
                  <span>{["🐠", "🐙", "🐳"][row]}</span>
                  <i>○</i>
                  <i>○</i>
                  <span>{["🐳", "🐠", "🐙"][row]}</span>
                </div>
              ) : fruits ? (
                <div className="matching-preview">
                  <span>{["🍓", "🍎", "🍌"][row]}</span>
                  <i>○</i>
                  <i>○</i>
                  <b>{["Apple", "Banana", "Strawberry"][row]}</b>
                </div>
              ) : shapes ? (
                <div className="shapes-preview">
                  <b>{["●", "▲", "■"][row]}</b>
                  <span>●</span>
                  <span>■</span>
                  <span>▲</span>
                </div>
              ) : numbers ? (
                <div className="math-preview">
                  {row + 1} + {row + 2} = <span />
                </div>
              ) : (
                <>
                  <span className="animal-group">
                    {Array.from({ length: row + 2 }, (_, i) => (
                      <span key={i}>{["🐤", "🐰", "🐢"][row]}</span>
                    ))}
                  </span>
                  <span className="answer-options">
                    {[row + 1, row + 2, row + 3].map((n) => (
                      <span key={n}>{n}</span>
                    ))}
                  </span>
                </>
              )}
            </div>
          ))
        )}
        <div className="sheet-bottom">
          <span>Kamu hebat! Terus mencoba, ya.</span>
          <span>☆ ☆ ☆</span>
        </div>
      </div>
    </div>
  );
}
export function HeroArt() {
  return (
    <div
      className="hero-art"
      aria-label="Ilustrasi worksheet, pensil, dan balok mainan 3D"
      role="img"
    >
      <div className="hero-orbit orbit-one" />
      <div className="hero-orbit orbit-two" />
      <div className="art-dot dot-one" />
      <div className="art-dot dot-two" />
      <div className="art-spark spark-one">✧</div>
      <div className="art-spark spark-two">✦</div>
      <div className="cloud cloud-one">
        <i />
        <i />
        <i />
      </div>
      <div className="toy-star">
        <span>★</span>
        <i className="star-eyes" />
      </div>
      <div className="paper-shadow" />
      <div className="hero-sheet">
        <WorksheetArt />
      </div>
      <div className="toy-pencil">
        <div className="pencil-eraser" />
        <div className="pencil-band" />
        <div className="pencil-body">
          <span />
        </div>
        <div className="pencil-tip" />
      </div>
      <div className="toy-block block-a">A</div>
      <div className="toy-block block-b">B</div>
      <div className="toy-ball" />
      <div className="art-label label-print">
        <span>🖨️</span> Siap jadi printable!
      </div>
      <div className="art-label label-idea">
        <span>✨</span> Dari ide jadi inspirasi
      </div>
      <div className="little-squiggle">〰</div>
    </div>
  );
}
