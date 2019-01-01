$j(document).ready(function() {
    $j("a.kpurchaser").click(function (event) {
        event.preventDefault();
        if (confirm('Really purchase ' + $j(this).siblings("strong").text().replace('!', '') + '?')) {
            $j(this).closest("form").submit();
        }
    });
});

function calculateTax(amount) {
    var sum = amount.value;

    if (isNaN(sum) || !sum) {
        $j(".taxcalc").hide();
    } else {
        var tax = Math.floor(sum * (konbiniSendTax / 100))
        var total = Math.floor(sum * ((konbiniSendTax / 100) + 1))
        $j("#sum").text(sum);
        $j("#tax").text(tax);
        $j("#total").text(total);
        $j(".taxcalc").show();
    }
}
