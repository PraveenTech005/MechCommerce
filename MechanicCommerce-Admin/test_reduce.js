const compatibilities = [
  { brand: { _id: "1", brand: "Yamaha" }, model: "R15" },
  { brand: { _id: "1", brand: "Yamaha" }, model: "FZ" },
  { brand: { _id: "2", brand: "Honda" }, model: "Dio" },
  { brand: { _id: "3", brand: "Suzuki" }, model: "Gixxer" },
  { brand: { _id: "2", brand: "Honda" }, model: "Activa" }
];

const formattedVehicles = Object.values(
  compatibilities.reduce((acc, c) => {
    const brandName = c.brand.brand;
    if (!acc[brandName]) {
      acc[brandName] = { brand: brandName, model: [] };
    }
    if (!acc[brandName].model.includes(c.model)) {
      acc[brandName].model.push(c.model);
    }
    return acc;
  }, {})
);

console.log(JSON.stringify(formattedVehicles, null, 2));
