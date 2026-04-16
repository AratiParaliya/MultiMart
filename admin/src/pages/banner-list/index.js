import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import Checkbox from "@mui/material/Checkbox";

import { useEffect, useState, useContext } from "react";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { Link } from "react-router-dom";
import { MyContext } from "../../App";
import { SearchContext } from "../../context/SearchContext";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];

  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,

    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },

    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const BannerList = () => {
  const [bannerData, setBannerData] = useState([]);
  const context = useContext(MyContext);
const { searchQuery } = useContext(SearchContext);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
const [totalPages, setTotalPages] = useState(1);
const [page, setPage] = useState(1);

  
  useEffect(() => {
    window.scrollTo(0, 0);
    context.setProgress(30);


 fetchDataFromApi("/api/banner").then((res) => {
  setBannerData(res.data || []);
  setTotalPages(res.totalPages || 1);
  setPage(res.page || 1);

      context.setProgress(100);
    });
  }, []);

const filteredData = bannerData?.filter((item) =>
  item.title?.toLowerCase().includes(searchQuery.toLowerCase())
);
  
  const dataToShow = searchQuery ? filteredData : bannerData;

  // ✅ DELETE BANNER
  const deleteBanner = async (id) => {
    try {
      await deleteData(`/api/banner/${id}`);

    setBannerData((prev) =>
  prev.filter((item) => item._id !== id)
);

      context.setAlertBox({
        open: true,
        error: false,
        msg: "Banner deleted successfully",
      });
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ PAGINATION (optional if backend supports)
  const handleChange = (event, value) => {
    fetchDataFromApi(`/api/banner?page=${value}`).then((res) => {
      setBannerData(res.data || []);  
     setTotalPages(res.totalPages || 1);   // ✅ important
    setPage(res.page || 1);     
    });
  };

  return (
    <>
      <div className="right-content w-100">
        
        {/* HEADER */}
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Banner List</h5>

          <div className="ml-auto d-flex align-items-center">
            <Breadcrumbs className="ml-auto breadcrumbs_">
              <StyledBreadcrumb
                component="a"
                href="#"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />

              <StyledBreadcrumb
                label="Banner List"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>

            <Link to="/banner">
             <Button className="btn-blue  ml-3 p-3 pr-3" style={{ height: "5px" }}>
                Add Banner
              </Button>
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <div className="card shadow border-0 p-3 mt-4 w-100">
          <div className="table-responsive mt-3">
            <table className="table table-striped table-bordered v-align">
              <thead className="thead-dark">
                <tr>
                  <th>UID</th>
                  <th style={{ width: "100px" }}>Image</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th style={{ width: "150px" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {
                   dataToShow?.length > 0 ? (
    dataToShow.map((item, index) => (
                    <tr key={item._id}>
                      
                      {/* UID */}
                      <td>
                        <div className="d-flex align-items-center">
                          <Checkbox {...label} />
                          <span> {index + 1}</span>
                        </div>
                      </td>

                      {/* IMAGE */}
                      <td>
                        <div className="d-flex bannerBox align-items-center">
                        <div className="imgWrapper">
                          <div className="img">
                            <img
                              src={item.images}
                              className="w-100"
                              alt="banner"
                            />
                          </div>
                          </div>
                          </div>
                      </td>

                      {/* TITLE */}
                      <td>{item.title}</td>

                      {/* DESC */}
                      <td>{item.desc}</td>

                      {/* STATUS */}
                     <td>
  <span
    className={`badge ${
      item.status === true || item.status === "true"
        ? "bg-success"
        : "bg-secondary"
    }`}
  >
    {item.status === true || item.status === "true"
      ? "Active"
      : "Inactive"}
  </span>
</td>

                      {/* ACTION */}
                      <td>
                        <div className="actions d-flex align-items-center">
                          <Link to={`/banner/${item._id}`}>
                            <Button color="success">
                              <FaPencilAlt />
                            </Button>
                          </Link>

                          <Button
                            color="error"
                            onClick={() => deleteBanner(item._id)}
                          >
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <h5 className="text-muted">No Banners Found 😔</h5>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="d-flex tableFooter">
              <p>
          showing <b>{page}</b> of <b>{totalPages}</b>
              </p>

             <Pagination
  className="pagination"
  count={totalPages}
  page={page}
  color="primary"
  onChange={handleChange}
  showFirstButton
  showLastButton
/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BannerList;