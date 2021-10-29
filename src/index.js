import "./styles.css";
import { checkDateDiff, checkDateDiffisOne } from "./utils";
import data from "./data";
import END_POINTS from "./configs";

/**
 * Find all available dates for a partner
 * Loop through all dates and check if difference is one day,
 * merge the partner with the existing date block or create a new date block
 * @param {Object} param0
 */
const findAvailableDatesForPartner = ({
  email,
  availableDates = [],
  currentDates = {}
}) => {
  // these are current available dates for a country
  const newDates = { ...currentDates };

  for (let i = 0; i < availableDates.length - 1; i++) {
    // identify if the next dates are diff by 1
    const date1 = availableDates[i];
    const date2 = availableDates[i + 1];

    if (checkDateDiffisOne(date1, date2)) {
      // check and add the partner into existing date block
      if (Array.isArray(newDates[date1])) {
        newDates[date1].push(email);
      } else {
        // create a new date block for the partner
        newDates[date1] = [email];
      }
    }
  }

  return newDates;
};

/**
 * For each country we already know valid date blocks
 * We need to find dates with maximum participants and
 * group the results by country
 * @param {Object} countryAvailabilityMap
 */
const groupAvailabilityByCountries = (countryAvailabilityMap = {}) => {
  const result = { countries: [] };

  // loop all countries and find max dates block
  Object.keys(countryAvailabilityMap).forEach((countryKey) => {
    const { dates: availableDates, countryName } = countryAvailabilityMap[
      countryKey
    ];

    // default values
    let attendeeCount = 0;
    let startDate = null;
    let attendees = [];

    Object.keys(availableDates).forEach((dateKey) => {
      let partnersAvailableNow = availableDates[dateKey].length;

      if (partnersAvailableNow > attendeeCount) {
        attendeeCount = partnersAvailableNow;
        startDate = dateKey;
        attendees = availableDates[dateKey];
      } else if (partnersAvailableNow === attendeeCount) {
        // if there is a collision, then find
        // which date is lowest,
        // dateKey is current looping date
        // start date is current possible lowest date
        let res = checkDateDiff(dateKey, startDate);

        if (res > 0) {
          attendeeCount = partnersAvailableNow;
          startDate = dateKey;
          attendees = availableDates[dateKey];
        }
      }
    });

    result.countries.push({
      startDate,
      attendeeCount,
      name: countryName,
      attendees
    });
  });

  return result;
};

/**
 * Loop through all partners and group by country first
 * then block dates
 * @param {Array} partners
 */
const findAvailabilityForPartners = (partners = []) => {
  /**
   * Shape:
   * <country-key>: {
   * countryName: <country-name>,
   * dates: {
   * <date-string>: [ <list of partners > ]
   * }
   * }
   */
  const countryAvailabilityMap = {};

  partners.map(({ country, email, availableDates = [] }) => {
    const countryKey = country.toLowerCase();

    // create the country in the current map
    if (!countryAvailabilityMap[countryKey]) {
      countryAvailabilityMap[countryKey] = { countryName: country, dates: {} };
    }

    // get current list of dates for all partner for this country
    // and add current partner dates into the same
    const { dates = {} } = countryAvailabilityMap[countryKey];

    countryAvailabilityMap[countryKey].dates = findAvailableDatesForPartner({
      email,
      availableDates,
      currentDates: dates
    });

    return {};
  });

  return groupAvailabilityByCountries(countryAvailabilityMap);
};

const postData = async (payload) => {
  const response = await fetch(END_POINTS.postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return response.json();
};

const fetchData = async () => {
  const response = await fetch(END_POINTS.url);
  const { partners = [] } = await response.json();
  const result = findAvailabilityForPartners(partners);

  postData(result).then((data) => {
    console.log(data);
  });
};

fetchData();
//findAvailabilityForPartners(data.partners));

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel 
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`;

export default findAvailabilityForPartners;
