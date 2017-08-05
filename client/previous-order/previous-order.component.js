angular.
  module('previousOrder').
  component('previousOrder', {
    template: `
<div>
  <label style="font-size:2em;">Order Number {{$ctrl.OrderId}}</label>
  <br>
    <label style="font-size:1em;">corrency:</label>
    <select ng-model="$ctrl.currency">
       <option value="dollar">Dollrs - $</option>
       <option value="shekel">Shekels - \u20AA</option>
    </select>
  <br>
  <table st-table="rowCollection" class="table table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Color</th>
        <th>Weigth</th>
        <th>Price</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      <tr ng-repeat="Dinosaur in $ctrl.Dinosaurs">
        <td>{{Dinosaur.ProductName}}</td>
        <td>{{Dinosaur.ProductColor}}</td>
        <td ng-init="$ctrl.TotalWeight = $ctrl.TotalWeight + (Dinosaur.ProductWeight * Dinosaur.Quantity)">{{Dinosaur.ProductWeight * Dinosaur.Quantity}} tons</td>
        <td ng-init="$ctrl.TotalPrice = $ctrl.TotalPrice + (Dinosaur.ProductPrice * Dinosaur.Quantity)" >
                <div ng-show="$ctrl.currency == 'dollar'">{{Dinosaur.ProductPrice * Dinosaur.Quantity | currency:"M$"}}</div>
                <div ng-show="$ctrl.currency == 'shekel'">{{Dinosaur.ProductPrice * Dinosaur.Quantity*3.7 | currency:"M\u20AA"}}</div>

        </td>
        <td ng-init="$ctrl.TotalQuantity = $ctrl.TotalQuantity + Dinosaur.Quantity">
         {{Dinosaur.Quantity}}
      </td>
 </tr>
 <tr>
  <th>TOTAL</th>
  <th></th>
  <th>{{$ctrl.TotalWeight}} tons</th>
  <th ng-show="$ctrl.currency == 'dollar'">{{$ctrl.TotalPrice| currency:"M$"}}</th>
  <th ng-show="$ctrl.currency == 'shekel'">{{$ctrl.TotalPrice*3.7 | currency:"M\u20AA"}}</th>
  <th>{{$ctrl.TotalQuantity}}</th>
</tr>
</tbody>
</table>
</div>
            `
    ,
  controller: ['httpService','$routeParams',function previousOrderController(httpService,$routeParams) {
        let self = this;
        self.currency = "dollar";
        self.OrderId = $routeParams.orderId;
        httpService.getPreviousOrder(self.OrderId).then(function(success){
            self.Dinosaurs = success;
        },function (error){
          console.log(error);
        });
      }
    ]
  });