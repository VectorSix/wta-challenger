// REST CLIENT IMPLEMENTATION
$(() => {
   const client = new RestApiClient();

   client.create("Brands", { name: "Toyota", branche: "Motor Cars" });

   console.log("READY");
});
