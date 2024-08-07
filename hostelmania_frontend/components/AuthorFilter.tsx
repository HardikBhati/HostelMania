import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from './AuthorFilter.module.scss'; // Adjust the path as necessary

const AuthorFilter = () => {
  const router = useRouter();
  const [author, setAuthor] = useState('');

  const handleFilterChange = (e:any) => {
    setAuthor(e.target.value);
  };

  const applyFilter = () => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, username: author },
    });
  };

  return (
    <div className={styles.filterContainer}>
      <input
        type="text"
        value={author}
        onChange={handleFilterChange}
        placeholder="Filter by Author/Owner"
        className={styles.inputField}
      />
      <button onClick={applyFilter} className={styles.button}>
        Apply Filter
      </button>
    </div>
  );
};

export default AuthorFilter;
