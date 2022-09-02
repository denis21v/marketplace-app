import React from 'react'
import styles from './Searchbar.module.css'
import { BiSearch } from 'react-icons/bi'

function Searchbar({ handleSearchSubmit, handleSearchChange, searchText }) {
  return (
    <form onSubmit={handleSearchSubmit} className={styles.searchbarForm}>
      <input
        type='text'
        value={searchText}
        placeholder='Search listings'
        onChange={handleSearchChange}
        className={styles.searchbarInput}
      />

      <button>
        <BiSearch size={30} />
      </button>
    </form>
  )
}

export default Searchbar
