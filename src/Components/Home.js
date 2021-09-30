import { react, useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

function Home() {
  const [data, setData] = useState([]); //main serach data
  const [category, setCategory] = useState([]);
  const [categoryValue, setCategoryValue] = useState('');
  const [forces, setForces] = useState([]);
  const [forceVlaue, setForceValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [offset, setOffset] = useState(0);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    axios.get('https://data.police.uk/api/crime-categories').then((res) => {
      setCategory(res.data);
    });

    axios.get('https://data.police.uk/api/forces').then((res) => {
      setForces(res.data);
    });
  }, []);

  const seacrhCrime = async () => {
    setLoading(true);
    if(categoryValue === "" || forceVlaue === ""){
      setLoading(false)
      alert('Please Choose...')
    }
    
    const res = await axios.get(
      `https://data.police.uk/api/crimes-no-location?category=${categoryValue}-crime&force=${forceVlaue}`
    );
    const data = res.data;
    if (data) {
      setLoading(false);
    }
    console.log(data, '*********SEARCH RESULTS***********');
    const slice = data.slice(offset, offset + perPage);
    const postData = slice.map((pd) => (
      <tr key={pd.id}>
        <td>{pd.id}</td>
        <td>{pd.category}</td>
        <td>{pd.month}</td>
      </tr>
    ));
    setData(postData);
    setPageCount(Math.ceil(data.length / perPage));

  };

  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1);
    seacrhCrime();
  };

  return (
    <>
      <h1 className="text-center">CRIME SEARCH @POLICE DEPARTEMNT</h1>

      <form className="my-4">
        <div className="d-flex">
          <select
            class="form-control mr-2"
            id="sel1"
            name="sellist1"
            onChange={(e) => setCategoryValue(e.target.value)}
          >
            <option value="" selected disabled>
              Select Category...
            </option>
            {category.map((item) => {
              return <option value={item.url}>{item.name}</option>;
            })}
          </select>
          <select
            className="form-control mr-2"
            id="sel1"
            name="sellist1"
            onChange={(e) => setForceValue(e.target.value)}
          >
            <option value="" selected disabled>
              Select Force...
            </option>
            {forces.map((item) => {
              return <option value={item.id}>{item.name}</option>;
            })}
          </select>
          {loading ? (
            <button class="btn btn-primary" disabled>
              <span class="spinner-border spinner-border-sm"></span>
            </button>
          ) : (
            <button
              type="button"
              onClick={seacrhCrime}
              className="btn btn-primary"
            >
              Search
            </button>
          )}
        </div>
      </form>

      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.length < 1 && <h5>No Data Found...</h5>}

          {data}
        </tbody>
      </table>
      {data.length < 1 ? (
        ''
      ) : (
        <ReactPaginate
          previousLabel={'prev'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      )}
    </>
  );
}

export default Home;
