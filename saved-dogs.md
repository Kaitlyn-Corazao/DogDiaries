# Objective

We want to create a new "saved dogs" experince

The following are from Figma to help us understand the experience

## Main Page

Adding a saved dogs button to the page header

```html
<div style="width: 131.71px; height: 36px; position: relative; background: white; outline: 1px #7B3306 solid; outline-offset: -1px">
  <div style="width: 16px; height: 16px; left: 13px; top: 10px; position: absolute; overflow: hidden">
    <div style="width: 9.33px; height: 12px; left: 3.33px; top: 2px; position: absolute; outline: 1.33px #7B3306 solid; outline-offset: -0.67px"></div>
  </div>
  <div style="left: 45px; top: 8.50px; position: absolute; text-align: center; color: #7B3306; font-size: 14px; font-family: Inter; font-weight: 500; line-height: 20px; word-wrap: break-word">Saved Tails</div>
</div>
```

## Detail Page

adding a Save Profile button to DogProfile page

```html
<div style="align-self: stretch; height: 36px; position: relative; background: #7B3306">
  <div style="width: 16px; height: 16px; left: 12px; top: 10px; position: absolute; overflow: hidden">
    <div style="width: 9.33px; height: 12px; left: 3.33px; top: 2px; position: absolute; outline: 1.33px white solid; outline-offset: -0.67px"></div>
  </div>
  <div style="left: 44px; top: 8.50px; position: absolute; text-align: center; color: white; font-size: 14px; font-family: Inter; font-weight: 500; line-height: 20px; word-wrap: break-word">Save Profile</div>
</div>
```

located here

```html
<div style="align-self: stretch; align-self: stretch; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 32px; display: inline-flex">
  <div style="align-self: stretch; height: 130px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
    <div style="align-self: stretch; height: 16px; position: relative">
      <div style="left: 0px; top: 1px; position: absolute; color: #6A7282; font-size: 12px; font-family: Inter; font-weight: 500; text-transform: uppercase; line-height: 16px; letter-spacing: 1.20px; word-wrap: break-word">Notable Accomplishments</div>
    </div>
    <div style="align-self: stretch; height: 102px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 12px; display: flex">
      <div style="align-self: stretch; height: 26px; position: relative; border-left: 2px #D1D5DC solid">
        <div style="left: 18px; top: -0.50px; position: absolute; color: #1E2939; font-size: 16px; font-family: Inter; font-weight: 400; line-height: 26px; word-wrap: break-word">Never missed a meal (perfect attendance)</div>
      </div>
      <div style="align-self: stretch; height: 26px; position: relative; border-left: 2px #D1D5DC solid">
        <div style="left: 18px; top: -0.50px; position: absolute; color: #1E2939; font-size: 16px; font-family: Inter; font-weight: 400; line-height: 26px; word-wrap: break-word">Never met a stick they didn't like</div>
      </div>
      <div style="align-self: stretch; height: 26px; position: relative; border-left: 2px #D1D5DC solid">
        <div style="left: 18px; top: -0.50px; position: absolute; color: #1E2939; font-size: 16px; font-family: Inter; font-weight: 400; line-height: 26px; word-wrap: break-word">Successfully caught their tail (once)</div>
      </div>
    </div>
  </div>
  <div style="align-self: stretch; height: 69px; padding-top: 33px; padding-right: 321.95px; border-top: 1px #E5E7EB solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
    <div style="align-self: stretch; height: 36px; position: relative; background: #7B3306">
      <div style="width: 16px; height: 16px; left: 12px; top: 10px; position: absolute; overflow: hidden">
        <div style="width: 9.33px; height: 12px; left: 3.33px; top: 2px; position: absolute; outline: 1.33px white solid; outline-offset: -0.67px"></div>
      </div>
      <div style="left: 44px; top: 8.50px; position: absolute; text-align: center; color: white; font-size: 14px; font-family: Inter; font-weight: 500; line-height: 20px; word-wrap: break-word">Save Profile</div>
    </div>
  </div>
  <div style="align-self: stretch; height: 72px; padding-top: 33px; border-top: 1px #E5E7EB solid; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
    <div style="align-self: stretch; height: 39px; position: relative">
      <div style="width: 404px; left: 0px; top: 0.50px; position: absolute; color: #6A7282; font-size: 12px; font-family: Inter; font-weight: 400; line-height: 19.50px; word-wrap: break-word">This profile is a work of fiction created for entertainment purposes. Any resemblance to actual dogs, living or departed, is purely coincidental.</div>
    </div>
  </div>
</div>
```

## Saved Dog Profiles

new saved dog profiles page

### the layout

#### headers
```html
<div style="align-self: stretch; height: 112px; padding-left: 32px; padding-right: 32px; justify-content: space-between; align-items: center; display: inline-flex">
  <div style="width: 227.20px; height: 80px; justify-content: flex-start; align-items: center; gap: 12px; display: flex">
    <img style="width: 80px; height: 80px; position: relative" src="https://placehold.co/80x80" />
    <div style="flex: 1 1 0; height: 28px; position: relative">
      <div style="left: 0px; top: 0px; position: absolute; color: #7B3306; font-size: 20px; font-family: Inter; font-weight: 500; line-height: 28px; word-wrap: break-word">The Dog Diaries</div>
    </div>
  </div>
  <div style="width: 86.99px; height: 36px; padding-left: 24px; padding-right: 24px; padding-top: 8px; padding-bottom: 8px; background: #7B3306; justify-content: center; align-items: center; gap: 8px; display: flex">
    <div style="text-align: center; color: white; font-size: 14px; font-family: Inter; font-weight: 500; line-height: 20px; word-wrap: break-word">Home</div>
  </div>
</div>
```

#### body

Dog tile like navigation of all our saved Dogs.  Should be responsive and repeat in rows below.

```html
<div style="align-self: stretch; height: 760px; padding-top: 64px; padding-left: 32px; padding-right: 32px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 48px; display: inline-flex">
  <div style="align-self: stretch; height: 119px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: flex">
    <div style="align-self: stretch; height: 75px; position: relative">
      <div style="left: 367.55px; top: 1px; position: absolute; text-align: center; color: #461901; font-size: 60px; font-family: Inter; font-weight: 500; line-height: 75px; word-wrap: break-word">Saved Tails</div>
    </div>
    <div style="align-self: stretch; height: 28px; position: relative">
      <div style="left: 347.34px; top: 0px; position: absolute; text-align: center; color: #973C00; font-size: 20px; font-family: Inter; font-weight: 400; line-height: 28px; word-wrap: break-word">Your collection of memorable dog tales</div>
    </div>
  </div>
  <div style="align-self: stretch; height: 465px; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: inline-flex">
    <div style="align-self: stretch; align-self: stretch; background: white; box-shadow: 0px 2px 4px -2px rgba(0, 0, 0, 0.10), 0px 4px 6px -1px rgba(0, 0, 0, 0.10); overflow: hidden; border-radius: 16px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
      <div style="align-self: stretch; flex: 1 1 0; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
        <img style="align-self: stretch; height: 333px; position: relative" src="https://placehold.co/341x333" />
      </div>
      <div style="width: 333px; height: 108px; padding-top: 24px; padding-left: 24px; padding-right: 24px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
        <div style="align-self: stretch; height: 32px; position: relative">
          <div style="left: 0px; top: 0px; position: absolute; color: #101828; font-size: 24px; font-family: Inter; font-weight: 500; line-height: 32px; word-wrap: break-word">Sir Barkington III</div>
        </div>
        <div style="align-self: stretch; height: 20px; position: relative">
          <div style="left: 0px; top: 0.50px; position: absolute; color: #4A5565; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 20px; word-wrap: break-word">Vice President of Belly Rubs</div>
        </div>
      </div>
    </div>
    <div style="align-self: stretch; align-self: stretch; background: white; box-shadow: 0px 2px 4px -2px rgba(0, 0, 0, 0.10), 0px 4px 6px -1px rgba(0, 0, 0, 0.10); overflow: hidden; border-radius: 16px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 24px; display: inline-flex">
      <div style="align-self: stretch; flex: 1 1 0; overflow: hidden; flex-direction: column; justify-content: flex-start; align-items: flex-start; display: flex">
        <img style="align-self: stretch; height: 333px; position: relative" src="https://placehold.co/341x333" />
      </div>
      <div style="width: 333px; height: 108px; padding-top: 24px; padding-left: 24px; padding-right: 24px; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px; display: flex">
        <div style="align-self: stretch; height: 32px; position: relative">
          <div style="left: 0px; top: 0px; position: absolute; color: #101828; font-size: 24px; font-family: Inter; font-weight: 500; line-height: 32px; word-wrap: break-word">Madame Slobber</div>
        </div>
        <div style="align-self: stretch; height: 20px; position: relative">
          <div style="left: 0px; top: 0.50px; position: absolute; color: #4A5565; font-size: 14px; font-family: Inter; font-weight: 400; line-height: 20px; word-wrap: break-word">Head of Treat Acquisition</div>
        </div>
      </div>
    </div>
  </div>
</div>
```
