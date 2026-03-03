const GenreFilter = ({ genres, onSelect }) => (
  <select onChange={(e) => onSelect(e.target.value)}>
    <option value="">All Genres</option>
    {genres.map(g => (
      <option key={g.id} value={g.id}>{g.name}</option>
    ))}
  </select>
);

export default GenreFilter;