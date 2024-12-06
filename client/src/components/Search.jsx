import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CiSearch } from "react-icons/ci";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/cars")
      .then((response) => {
        setCars(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cars:", error);
      });
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() !== "") {
      const results = cars.filter((car) =>
        car.carName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCars(results);
    } else {
      setFilteredCars([]);
    }
  };

  return (
    <div className="search-container flex flex-col gap-1 relative">
      <div className="flex flex-row items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for a car..."
          className="rounded-md w-36 lg:w-96 border-2 p-2"
        />
        <CiSearch className="-mx-6 mt-1 text-lg" />
      </div>

      {searchQuery && filteredCars.length > 0 && (
        <div className="absolute z-10 bg-white w-36 lg:w-96 border mt-1 rounded-md">
          <ul>
            {filteredCars.map((car) => (
              <li
                key={car.id}
                className="p-2 border-b last:border-none hover:bg-gray-100"
              >
                <Link to={`/cars/${car.id}`}>{car.carName}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchQuery && filteredCars.length === 0 && (
        <div className="absolute z-10 bg-white w-36 lg:w-96 mt-1 p-2 text-sm">
          No cars found.
        </div>
      )}
    </div>
  );
};

export default Search;
