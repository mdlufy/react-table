import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Table from "./components/Table";
import TableSearch from "./components/TableSearch";
import _ from "lodash";
import "./styles/styles.css";
import Users from "./generated.json";
import usePagination from "./hooks/usePagination";

function App() {
  const [data, setData] = useState(Users);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [sortField, setSortField] = useState("id");
  const [currentPage, setCurrentPage] = useState(0);
  const {
    firstContentIndex,
    lastContentIndex,
    nextPage,
    prevPage,
    page,
    setPage,
    totalPages,
  } = usePagination({
    contentPerPage: 3,
    count: data.length,
  });
 
  const onSort = (sortField: any) => {
    const cloneData = data.concat();
    const sortType = sort === "asc" ? "desc" : "asc";
    const rows = _.orderBy(cloneData, sortField, sort);

    setData(rows);
    setSort(sortType);
    setSortField(sortField);
  };

  const pageChangeHandler = ({ selected }: any) => setCurrentPage(selected);

  const searchHandler = (search: any) => {
    setSearch(search);
    setCurrentPage(0);
  };

  const getFilteredData = () => {
    if (!search) {
      return data;
    }

    let result = data.filter((item: any) => {
      return (
        item["firstName"].toLowerCase().includes(search.toLowerCase()) ||
        item["lastName"].toLowerCase().includes(search.toLowerCase()) ||
        item["email"].toLowerCase().includes(search.toLowerCase())
      );
    });

    if (!result.length) {
      result = data;
    }

    return result;
  };

  const pageSize = 15;


  const filteredData = getFilteredData();
  const pageCount = Math.ceil(filteredData.length / pageSize);
  const displayData = _.chunk(filteredData, pageSize)[currentPage];

  return (
    <div className="container">
      {
        <React.Fragment>
          <TableSearch onSearch={searchHandler} />
          <Table
            data={displayData}
            onSort={onSort}
            sort={sort}
            sortField={sortField}
          />
        </React.Fragment>
      }

      {data.length > pageSize ? (
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={pageChangeHandler}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          nextClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          forcePage={currentPage}
        />
      ) : null}
    </div>
  );
}

export default App;
