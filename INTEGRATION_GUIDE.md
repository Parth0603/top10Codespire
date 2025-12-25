# Detective Page Integration Guide

## Overview
This guide shows how to integrate the CODESPIRE 3.0 Detective Top 10 reveal page into your main GDG AITR website.

## File Structure
```
main-website/
├── index.html (your main website)
├── style.css (your main website styles)
├── script.js (your main website scripts)
├── top10/ (detective page folder)
│   ├── app.py (Flask entry point)
│   ├── backend/
│   │   ├── app.py (Flask backend)
│   │   └── requirements.txt
│   ├── frontend/
│   │   ├── index.html (detective page)
│   │   ├── style.css (updated with GDG theme)
│   │   └── script.js (detective functionality)
│   └── requirements.txt
└── detective-button.html (integration code)
```

## Integration Steps

### 1. Add Detective Access Button to Main Website

Copy the code from `detective-button.html` and add it to your main website's HTML file, just before the closing `</body>` tag:

```html
<!-- Add this to your main website's HTML -->
<div class="detective-access-btn" onclick="window.open('/top10', '_blank')" title="🔍 Detective Case Files">
    <svg class="magnifying-glass" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
        <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
</div>
```

### 2. Add Button Styles to Main Website CSS

Add the CSS from `detective-button.html` to your main website's CSS file.

### 3. Deploy Detective Page

1. Place the entire `top10` folder in your main website directory
2. Ensure your web server can serve static files from subdirectories
3. The detective page will be accessible at `yoursite.com/top10`

### 4. Update Navigation Links (Optional)

If you want the detective page navigation to work properly, update the links in `frontend/index.html`:

```html
<li><a href="../" class="nav-link">Home</a></li>
<li><a href="../about" class="nav-link">About Us</a></li>
<!-- etc. -->
```

## Theme Matching Features

The detective page now includes:

✅ **Color Scheme**: Matches your main website's soft pastels and clean whites
✅ **Typography**: Uses same font family as main website
✅ **Navigation**: Includes GDG AITR navigation bar
✅ **Cards**: Rounded corners and subtle shadows like main website
✅ **Buttons**: Gradient backgrounds matching your design language
✅ **Responsive**: Mobile-friendly design
✅ **Detective Elements**: Maintains mystery theme with magnifying glass icons and case terminology

## Button Features

- **Position**: Fixed bottom-left corner
- **Design**: Magnifying glass icon with dark theme + gold accent
- **Hover Effects**: Scale up, glow, color change
- **Tooltip**: Shows "🔍 Detective Case Files" on hover
- **Mobile Responsive**: Smaller size on mobile devices
- **Pulse Animation**: Subtle attention-grabbing animation

## Customization Options

### Change Button Position
```css
.detective-access-btn {
    bottom: 30px; /* Change this */
    left: 30px;   /* Change this */
}
```

### Change Button Colors
```css
.detective-access-btn {
    background: linear-gradient(135deg, #your-color 0%, #your-color2 100%);
}
```

### Change Button Size
```css
.detective-access-btn {
    width: 70px;  /* Increase size */
    height: 70px; /* Increase size */
}
```

## Testing

1. Add the button to your main website
2. Place the `top10` folder in your website directory
3. Click the detective button - it should open the reveal page
4. Verify the navigation links work correctly
5. Test on mobile devices

## Security Notes

The detective page includes:
- Server-side time validation
- No-cache headers
- Backend-only data storage
- Keep-alive functionality to prevent Render spin-down

## Support

If you need to modify the reveal time or add additional security, edit the `backend/app.py` file:

```python
# Change reveal time (currently 30 seconds for testing)
REVEAL_TIME = datetime.now() + timedelta(seconds=30)
```

The integration maintains both the professional look of your main website and the exciting detective mystery theme for the reveal page!