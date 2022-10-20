var getAgefactor = (clientAccount) => {
    var factor;
    if (clientAccount.age < 18 || clientAccount.age > 95)
        factor = 0;
    else if (clientAccount.age < 25)
        factor = 10;
    else if (clientAccount.age < 35)
        factor = 15;
    else if (clientAccount.age < 45)
        factor = 20;
    else if (clientAccount.age < 65)
        factor = 45;
    else if (clientAccount.age <= 95)
        factor = 25
    return factor;
}

var getBalanceFactor = (clientAccount) => {
    var factor;
    if (clientAccount.balance <= 0 || clientAccount.balance >= 5000)
        factor = 0;
    else if (clientAccount.balance < 100)
        factor = 5;
    else if (clientAccount.balance < 500)
        factor = 15;
    else if (clientAccount.balance < 1000)
        factor = 25;
    else if (clientAccount.balance < 3000)
        factor = 65;
    else if (clientAccount.balance < 5000)
        factor = 150;
    return factor;
}

var accountStatus = (clientAccount) => {
    var ageFactor = getAgefactor(clientAccount);
    var balanceFactor = getBalanceFactor(clientAccount);
    var factor = ageFactor * balanceFactor;
    if (factor == 0) {
        return "invalid";
    }
    else if (factor < 150) {
        return "adverse";
    }
    else if (factor < 600) {
        return "acceptable";
    }
    else if (factor < 1000) {
        return "good";
    }
    else {
        return "excellent";
    }
}

var creditStatus = (clientAccount, creditCheckMode) => {
    var scoreThreshold;
    if (clientAccount.creditScore < 0 || clientAccount.creditScore > 100)
        return "invalid";
    if (creditCheckMode === "strict")
        scoreThreshold = 65;
    else if (creditCheckMode === "default")
        scoreThreshold = 75;

    if (clientAccount.creditScore < scoreThreshold)
        return "adverse"
    else return "good";
}

var productStatus = (product, inventory, inventoryThreshold) => {
    var q;
    for (let i = 0; i < inventory.length; i++) {
        if (product == inventory[i].name) {
            q = inventory[i].q;
            if (q == 0)
                return "soldout";
            else if (q < inventoryThreshold)
                return "limited";
            else return "available";
        }
    }
    return "invalid";
}

var orderHandling = (clientAccount, product, inventory, inventoryThreshold, creditCheckMode) => {
    var accStatus = accountStatus(clientAccount);
    var creStatus = creditStatus(clientAccount, creditCheckMode);
    var proStatus = productStatus(product, inventory, inventoryThreshold);

    if ((accStatus === "invalid" || creStatus === "invalid" || proStatus === "invalid") ||
        (accStatus === "acceptable" || creStatus === "adverse" || proStatus != "available") ||
        (accStatus === "adverse" || creStatus === "good" || proStatus === "soldout") ||
        (accStatus === "adverse" || creStatus === "adverse"))
        return "rejected";

    else if ((accStatus === "excellent") || (accStatus === "good" && creStatus === "good") ||
        (accStatus === "acceptable" && creStatus === "good" && proStatus === "available") || (accStatus === "adverse" && creStatus === "good" && proStatus === "available"))
        return "accepted";
    else if ((accStatus === "good" || creStatus === "adverse") || (accStatus === "acceptable" || creStatus === "adverse" && proStatus === "available"))
        return "underReview";
    else if ((accStatus === "acceptable" && creStatus === "good" && proStatus != "available") ||
        (accStatus === "adverse" && creStatus === "good" && proStatus === "limited"))
        return "pending";
}

class clientAccount {
    constructor(age, balance, creditScore) {
        this.age = age;
        this.balance = balance;
        this.creditScore = creditScore;
    }
}

class product {
    constructor(name, q) {
        this.name = name;
        this.q = q;
    }
}

describe("Statement Coverage", () => {
    it("Statement: rejected", () => {
        const customer = new clientAccount(30, 5, 80);
        const newProduct = new product("Product 1", 0);
        var inventory = [newProduct];
        expect(orderHandling(customer, "Product 1", inventory, 5, "default")).toBe("rejected");
    })
    it("Statement: accepted", () => {
        const customer = new clientAccount(30, 400, 80);
        const newProduct = new product("Product 2", 10);
        var inventory = [newProduct];
        expect(orderHandling(customer, "Product 2", inventory, 5, "default")).toBe("accepted");
    })
    it("Statement: underReview", () => {
        const customer = new clientAccount(30, 400, 50);
        const newProduct = new product("Product 3", 10);
        var inventory = [newProduct];
        expect(orderHandling(customer, "Product 3", inventory, 5, "default")).toBe("underReview");
    })
    it("Statement: pending", () => {
        const customer = new clientAccount(25, 5, 80);
        const newProduct = new product("Product 4", 4);
        var inventory = [newProduct];
        expect(orderHandling(customer, "Product 4", inventory, 5, "default")).toBe("pending");
    })
})

describe("Branch Coverage", () => {
    it("Branch Coverage: rejected", () => {
        const customer = new clientAccount(25, 5, 80);
        const newProduct = new product("Product 5", 0);
        var inventory = [newProduct];
        expect(orderHandling(customer, "Product 5", inventory, 5, "default")).toBe("rejected");
    })
    it("Branch Coverage: accepted", () => {
        const customer = new clientAccount(30, 400, 80);
        const newProduct = new product("Product 6", 10);
        var inventory = [newProduct];
        expect(orderHandling(customer, "Product 6", inventory, 5, "default")).toBe("accepted");
    })
    it("Branch Coverage: underReview", () => {
        const customer = new clientAccount(30, 400, 50);
        const newProduct = new product("Product 7", 10);
        var inventory = [newProduct];
        expect(orderHandling(customer, "Product 7", inventory, 5, "default")).toBe("underReview");
    })
    it("Branch Coverage: pending", () => {
        const customer = new clientAccount(25, 5, 80);
        const newProduct = new product("Product 8", 4);
        var inventory = [newProduct];
        expect(orderHandling(customer, "Product 8", inventory, 5, "default")).toBe("pending");
    })
})

describe("Path Coverage", () => {
    describe("Rejected", () => {
        it("Credit invalid (too low)", () => {
            const customer = new clientAccount(35, 700, -1);
            const newProduct = new product("Product", 4);
            var inventory = [newProduct];
            expect(orderHandling(customer, "Product", inventory, 5, "default")).toBe("rejected");
        })
        it("Credit invalid (too high)", () => {
            const customer = new clientAccount(55, 700, 200);
            const newProduct = new product("Product", 4);
            var inventory = [newProduct];
            expect(orderHandling(customer, "Product", inventory, 5, "default")).toBe("rejected");
        })
        it("Age Factor Invalid (too low)", () => {
            const customer = new clientAccount(0, 700, 200);
            const newProduct = new product("Product", 4);
            var inventory = [newProduct];
            expect(orderHandling(customer, "Product", inventory, 5, "default")).toBe("rejected");
        })
        it("Age Factor Invalid (too high)", () => {
            const customer = new clientAccount(200, 700, 200);
            const newProduct = new product("Product", 4);
            var inventory = [newProduct];
            expect(orderHandling(customer, "Product", inventory, 5, "default")).toBe("rejected");
        })
        it("Balance Factor Invalid (too low)", () => {
            const customer = new clientAccount(55, 0, 200);
            const newProduct = new product("Product", 4);
            var inventory = [newProduct];
            expect(orderHandling(customer, "Product", inventory, 5, "default")).toBe("rejected");
        })
        it("Balance Factor Invalid (too high)", () => {
            const customer = new clientAccount(55, 7000, 200);
            const newProduct = new product("Product", 4);
            var inventory = [newProduct];
            expect(orderHandling(customer, "Product", inventory, 5, "default")).toBe("rejected");
        })
        it("Account Acceptable, Credit Adverse, Product Soldout", () => {
            const customer = new clientAccount(17, 700, 24000);
            const newProduct = new product("Product", 4);
            var inventory = [newProduct];
            expect(orderHandling(customer, "Product", inventory, 5, "default")).toBe("rejected");
        })
        
    })
})