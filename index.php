<!DOCTYPE html>
<html lang="en">

<head>
   

    

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css"
        integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu" crossorigin="anonymous">
    <link rel="stylesheet" href="css/site.css" />
</head>

<body>


   <body>
   <?php include 'nav_bar.php'; ?>
    <div class="container">
        <main role="main" class="pb-3">
            <div class="row flex">
                <!-- div for 2 pie and 1 timeline -->
                <div class="col-md-12 col-lg-7">
                       <div class="row">
                         <h3 style="text-align: center;">Pie charts of deaths by age & Sex</h3>

                        <div class="col-md-6 col-sm-12">
                            <!-- age pie chart -->
                        <div id="age-pie"></div>
                           
                        </div>
                      <!-- pie-chart-gender -->
                         <div id="pie-gender"></div>
                         
                    </div>
                    <div class="row">
                      <!-- timeline chart display -->  
                 <div id="timeline-chart" ></div> </div>
                </div>
                <!-- Road map container -->
                <div>
                <h3 style="text-align: center;">London Street Road Map</h3>
                 <div id="map-streets" ></div>
                 </div>
            </div>
        </main>
    </div>

   
</body>







<style>
  #map-streets{

    transition: transform 0.2s ease-out; 
  }
</style>

<!-- zoom feture for map -->
<script>
  var zoom_level = 1; 
  var zoom_increase = 0.1; 

  document.getElementById("map-streets").addEventListener("wheel", function(event) {
    event.preventDefault(); 

    
    if (event.deltaY < 0) {
      zoom_level += zoom_increase;
    } else {
      zoom_level -= zoom_increase;
    }

   
    if (zoom_level < 0.1) {
      zoom_level = 0.1;
    } else if (zoom_level > 3) {
      zoom_level = 3;
    }

    
    var content = this.children[0];
    content.style.transform = "scale(" + zoom_level + ")";
  });
</script>




    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.1.min.js"
        integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js"
        integrity="sha384-aJ21OjlMXNL5UyIl/XNwTMqvzeRMZH2w8c5cRVpzpU8Y5bApTppSuUkhZXN0VxHd"
        crossorigin="anonymous"></script>

    <script src="js/data_import.js"></script>
    <script src="js/map-line.js"></script>
    <script src="js/pie_chart.js"></script>
    <script src="js/load_map.js"></script>

</body>

</html>