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
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2
    });

    if (isNaN(sum) || !sum) {
        $j(".taxcalc").hide();
    } else {
        var tax = (formatter.format(parseFloat(sum) * (konbiniSendTax / 100)));
        var total = (formatter.format(parseFloat(sum) * ((konbiniSendTax / 100) + 1)));
        sum = formatter.format(parseFloat(sum));
        $j("#sum").text(sum);
        $j("#tax").text(tax);
        $j("#total").text(total);
        $j(".taxcalc").show();
    }
}
