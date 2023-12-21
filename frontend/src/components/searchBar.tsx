import { Form, InputGroup } from "react-bootstrap";

interface SearchComponentProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchBar = ({ search, setSearch }: SearchComponentProps) => {
  return (
    <InputGroup className="mb-3 search-bar">
      <InputGroup.Text id="basic-addon1">
        Search for repositories:{" "}
      </InputGroup.Text>
      <Form.Control
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="react"
        aria-label="react"
      />
    </InputGroup>
  );
};

export default SearchBar;
