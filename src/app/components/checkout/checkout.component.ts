import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order_item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutFormService } from 'src/app/services/checkout-form.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormValidators } from 'src/app/validators/formValidator';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalValue: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder, 
              private checkoutFormService: CheckoutFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {
    const userEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        'firstName': new FormControl('',        [Validators.required, Validators.minLength(2), FormValidators.notBlank]),
        'lastName':  new FormControl('',        [Validators.required, Validators.minLength(2), FormValidators.notBlank]),
        'email':     new FormControl(userEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') ])
      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street:  new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notBlank]),
        city:    new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notBlank]),
        state:   new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notBlank])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street:  new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notBlank]),
        city:    new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notBlank]),
        state:   new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notBlank])
      }),
      creditCard: this.formBuilder.group({
        cardType:        new FormControl('', [Validators.required]),
        nameOnCard:      new FormControl('', [Validators.required, Validators.minLength(2), FormValidators.notBlank]),
        cardNumber:      new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode:    new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear:  new FormControl('', [Validators.required])
      })
    });

    const startMonth: number = new Date().getMonth() + 1;
    console.log(`startMonth: ${startMonth}`);
    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(`Retrived months for credit card: ${JSON.stringify(data)}`);
        this.creditCardMonths = data;
      }
    );

    this.checkoutFormService.getCreditCardYears().subscribe(
      data => {
        console.log(`Retrived years for credit card: ${JSON.stringify(data)}`);
        this.creditCardYears = data;
      }
    );

    this.checkoutFormService.getCountryList().subscribe(
      data => {
        this.countries = data;
      }
    );

    this.computeCartSummary();
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName()  { return this.checkoutFormGroup.get('customer.lastName'); }
  get email()     { return this.checkoutFormGroup.get('customer.email') }

  get shippingStreet()  { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingCity()    { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingState()   { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingStreet()  { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingCity()    { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingState()   { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType()         { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard()   { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber()       { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpMonth()     { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpYear()      { return this.checkoutFormGroup.get('creditCard.expirationYear'); }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      console.log('invalid');
      this.checkoutFormGroup.markAllAsTouched();

      //return;
    }

    // set up order
    const order: Order = new Order();
    order.totalQuantity = this.totalQuantity;
    order.totalValue = this.totalValue;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems from cartItems
    const orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));

    //set up purchase
    let purchase = new Purchase();

    //set customer
    purchase.customer = this.checkoutFormGroup.get('customer')?.value;

    //set shipping address
    purchase.shippingAddress = this.checkoutFormGroup.get('shippingAddress')?.value;
    purchase.shippingAddress.state = this.shippingState?.value.name;
    purchase.shippingAddress.country = this.shippingCountry?.value.name;

    //set billing address
    purchase.billingAddress = this.checkoutFormGroup.get('billingAddress')?.value;
    purchase.billingAddress.state = this.billingState?.value.name;
    purchase.billingAddress.country = this.billingCountry?.value.name;

    //set order and order items
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call REST API
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\n Order tracking number is ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: err => {
        alert(`There was an error ${err.message}`)
      }
    });
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingStates = this.shippingStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingStates = [];
    }
  }

  handleYearChange() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.checkoutFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log(`Retrived months for credit card: ${JSON.stringify(data)}`);
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.checkoutFormService.getStateList(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingStates = data;
        } else {
          this.billingStates = data;
        }
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  computeCartSummary() {
    this.cartService.totalValue.subscribe(
      data => this.totalValue = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalQuantity.next(0);
    this.cartService.totalValue.next(0);

    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");
  }
}
