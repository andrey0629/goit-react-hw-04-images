import PropTypes from 'prop-types';
import { useState } from 'react';
import { IconContext } from 'react-icons';
import { FcSearch } from 'react-icons/fc';
import { SearchbarStyle, SearchForm, Button, Input } from './Searchbar.styled';
export function Searchbar({ request }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = e => {
    const { value } = e.target;
    setInputValue(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (inputValue === '') {
      return;
    }
    request({ inputValue });
    setInputValue('');
  };

  return (
    <SearchbarStyle>
      <SearchForm onSubmit={handleSubmit}>
        <Button type="submit">
          <IconContext.Provider value={{ size: 35 }}>
            <FcSearch />
          </IconContext.Provider>
        </Button>

        <Input
          name="search"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={inputValue}
          onChange={handleChange}
        />
      </SearchForm>
    </SearchbarStyle>
  );
}
Searchbar.propTypes = {
  request: PropTypes.func.isRequired,
};
