/*
    QuackDuck Swing Utils for DeadZone.dev
*/

const JFrame = Java.type("javax.swing.JFrame");
const JPanel = Java.type("javax.swing.JPanel");
const JLabel = Java.type("javax.swing.JLabel");
const JPasswordField = Java.type("javax.swing.JPasswordField");
const JButton = Java.type("javax.swing.JButton");
const ButtonGroup = Java.type("javax.swing.ButtonGroup");
const JRadioButton = Java.type("javax.swing.JRadioButton");
const JCheckBox = Java.type("javax.swing.JCheckBox");
const JComboBox = Java.type("javax.swing.JComboBox");
const JScrollPane = Java.type("javax.swing.JScrollPane");
const JTextArea = Java.type("javax.swing.JTextArea");
const JTextField = Java.type("javax.swing.JTextField");
const JSeparator = Java.type("javax.swing.JSeparator");
const JSlider = Java.type("javax.swing.JSlider");
const JProgressBar = Java.type("javax.swing.JProgressBar");
const JTable = Java.type("javax.swing.JTable");
const DefaultTableModel = Java.type("javax.swing.table.DefaultTableModel");
const JDialog = Java.type("javax.swing.JDialog");
const JTabbedPane = Java.type("javax.swing.JTabbedPane");
const JOptionPane = Java.type("javax.swing.JOptionPane");
const ChangeListener = Java.type("javax.swing.event.ChangeListener");
const Hashtable = Java.type("java.util.Hashtable");
const TableRowSorter = Java.type("javax.swing.table.TableRowSorter");
const BorderLayout = Java.type("java.awt.BorderLayout");
const FlowLayout = Java.type("java.awt.FlowLayout");
const GridLayout = Java.type("java.awt.GridLayout");
const Insets = Java.type("java.awt.Insets");
const GridBagLayout = Java.type("java.awt.GridBagLayout");
const GridBagConstraints = Java.type("java.awt.GridBagConstraints");
const Color = Java.type("java.awt.Color");
const Font = Java.type("java.awt.Font");
const BorderFactory = Java.type("javax.swing.BorderFactory");
const BoxLayout = Java.type("javax.swing.BoxLayout");
const Box = Java.type("javax.swing.Box");
const SwingConstants = Java.type("javax.swing.SwingConstants");
const Dimension = Java.type("java.awt.Dimension");
const PointJ = Java.type("java.awt.Point");
const Timer = Java.type("javax.swing.Timer");
const UtilTimer = Java.type("java.util.Timer");
const TimerTask = Java.type("java.util.TimerTask");
const Executors = Java.type("java.util.concurrent.Executors");
const TimeUnit = Java.type("java.util.concurrent.TimeUnit");
const Runnable = Java.type("java.lang.Runnable");
const ActionListener = Java.type("java.awt.event.ActionListener");
const MouseAdapter = Java.type("java.awt.event.MouseAdapter");
const SwingUtilities = Java.type("javax.swing.SwingUtilities");
const EmptyBorder = Java.type("javax.swing.border.EmptyBorder");
const TitledBorder = Java.type("javax.swing.border.TitledBorder");
const MouseEvent = Java.type("java.awt.event.MouseEvent");
const KeyEvent = Java.type("java.awt.event.KeyEvent");
const KeyAdapter = Java.type("java.awt.event.KeyAdapter");
const ScrollPaneConstants = Java.type("javax.swing.ScrollPaneConstants");

class SwingUtils {
    /**
     * @typedef {Object} Window
     * @property {string} id - Unique identifier for the window.
     * @property {JFrame} frame - The JFrame instance of the window.
     * @property {JPanel} mainPanel - The main panel of the window.
     * @property {JPanel} headerPanel - The header panel of the window.
     * @property {JPanel} contentPanel - The content panel of the window.
     * @property {JLabel} titleLabel - The label showing the title of the window.
     * @property {Object} colorScheme - The color scheme used for the window.
     * @property {Object} panels - Collection of panels created in the window.
     * @property {Object} components - Collection of components created in the window.
     * @property {Array<Timer>} timers - List of timers associated with the window.
     * @property {Function} show - Method to show the window.
     * @property {Function} hide - Method to hide the window.
     * @property {Function} toggle - Method to toggle the visibility of the window.
     * @property {Function} dispose - Method to dispose of the window.
     * @property {Function} setTitle - Method to set the window title.
     * @property {Function} createPanel - Method to create a panel in the window's content area.
     * @property {Function} createLabel - Method to create a label in a panel.
     * @property {Function} createButton - Method to create a button in a panel.
     * @property {Function} createCheckbox - Method to create a checkbox in a panel.
     * @property {Function} createComboBox - Method to create a dropdown (combo box) in a panel.
     * @property {Function} createProgressBar - Method to create a progress bar in a panel.
     * @property {Function} createTextArea - Method to create a text area in a panel.
     * @property {Function} createSeparator - Method to create a separator in a panel.
     * @property {Function} updateComponent - Method to update a component's text or value.
     * @property {Function} updatePanelTitle - Method to update a panel's title.
     * @property {Function} createTimer - Method to create a timer for periodic updates.
     * @property {Function} highlightComponent - Method to highlight a component for attention.
     * @property {Function} updatePanelColor - Method to update panel background color.
     */

    /**
     * Creates a new overlay window with customizable options
     * 
     * @param {Object} options - Configuration options for the window
     * @param {string} options.id - Unique identifier for the window
     * @param {string} options.title - Title of the window
     * @param {Object} [options.colorScheme] - Color scheme to use (defaults to DARK)
     * @param {number} [options.width=300] - Width of the window
     * @param {number} [options.height=200] - Height of the window
     * @param {number} [options.x=50] - Initial X position of the window
     * @param {number} [options.y=50] - Initial Y position of the window
     * @param {boolean} [options.closable=true] - Whether the window has a close button
     * @param {boolean} [options.resizable=false] - Whether the window is resizable
     * @param {boolean} [options.draggable=true] - Whether the window is draggable
     * @param {Function} [options.onClose] - Callback function when window is closed
     * @returns {Object} Created window object with methods for manipulation
     */
    static createWindow(options) {
        let dragStartX = 0;
        let dragStartY = 0;
        if (!options || !options.id) {
            throw new Error("Window ID is required");
        }

        if (this.windows[options.id]) {
            return this.windows[options.id];
        }

        const id = options.id;
        const title = options.title || "DeadZone Overlay";
        const colorScheme = options.colorScheme || this.ColorSchemes.DARK;
        const width = options.width || 300;
        const height = options.height || 200;
        const x = options.x || 50;
        const y = options.y || 50;
        const closable = options.closable !== false;
        const resizable = options.resizable === true;
        const draggable = options.draggable !== false;
        const onClose = options.onClose || function () { };

        const frame = new JFrame(title);
        frame.setUndecorated(true);
        frame.setAlwaysOnTop(true);
        frame.setBackground(new Color(0, 0, 0, 0));

        const mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout());
        mainPanel.setBackground(colorScheme.background);
        mainPanel.setBorder(BorderFactory.createLineBorder(colorScheme.border, 1));

        const headerPanel = new JPanel();
        headerPanel.setLayout(new BorderLayout());
        headerPanel.setBackground(colorScheme.headerBackground);
        headerPanel.setBorder(BorderFactory.createEmptyBorder(5, 10, 5, 10));

        const titleLabel = new JLabel(title);
        titleLabel.setForeground(colorScheme.text);
        titleLabel.setFont(new Font("Dialog", Font.BOLD, 12));
        headerPanel.add(titleLabel, BorderLayout.WEST);

        if (closable) {
            const closeButton = new JLabel("X");
            closeButton.setForeground(colorScheme.text);
            closeButton.setFont(new Font("Dialog", Font.BOLD, 12));

            const closeButtonListener = Java.extend(MouseAdapter, {
                mouseClicked: function (e) {
                    frame.setVisible(false);
                    onClose();
                }
            });
            closeButton.addMouseListener(new closeButtonListener());
            headerPanel.add(closeButton, BorderLayout.EAST);
        }

        if (draggable) {
            dragStartX = 0;
            dragStartY = 0;

            const headerDragListener = Java.extend(MouseAdapter, {
                mousePressed: function (e) {
                    dragStartX = e.getX();
                    dragStartY = e.getY();
                },
                mouseDragged: function (e) {
                    const currentLocation = frame.getLocation();
                    frame.setLocation(
                        currentLocation.x + e.getX() - dragStartX,
                        currentLocation.y + e.getY() - dragStartY
                    );
                }
            });
            headerPanel.addMouseListener(new headerDragListener());
            headerPanel.addMouseMotionListener(new headerDragListener());
        }

        const contentPanel = new JPanel();
        contentPanel.setLayout(new BorderLayout());
        contentPanel.setBackground(colorScheme.panelBackground);
        contentPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        mainPanel.add(headerPanel, BorderLayout.NORTH);
        mainPanel.add(contentPanel, BorderLayout.CENTER);
        frame.add(mainPanel);

        frame.setPreferredSize(new Dimension(width, height));
        frame.pack();
        frame.setLocation(new PointJ(x, y));

        if (resizable) {
            const resizeCornerSize = 15;
            const resizeCorner = new JPanel();
            resizeCorner.setPreferredSize(new Dimension(resizeCornerSize, resizeCornerSize));
            resizeCorner.setBackground(new Color(0, 0, 0, 0));
            resizeCorner.setCursor(Java.type("java.awt.Cursor").getPredefinedCursor(Java.type("java.awt.Cursor").SE_RESIZE_CURSOR));

            const resizeListener = Java.extend(MouseAdapter, {
                mousePressed: function (e) {
                    dragStartX = e.getXOnScreen();
                    dragStartY = e.getYOnScreen();
                },
                mouseDragged: function (e) {
                    const deltaX = e.getXOnScreen() - dragStartX;
                    const deltaY = e.getYOnScreen() - dragStartY;

                    const newWidth = Math.max(100, frame.getWidth() + deltaX);
                    const newHeight = Math.max(100, frame.getHeight() + deltaY);

                    frame.setSize(newWidth, newHeight);
                    dragStartX = e.getXOnScreen();
                    dragStartY = e.getYOnScreen();
                }
            });
            resizeCorner.addMouseListener(new resizeListener());
            resizeCorner.addMouseMotionListener(new resizeListener());

            mainPanel.add(resizeCorner, BorderLayout.SOUTHEAST);
        }

        const windowObj = {
            id,
            frame,
            mainPanel,
            headerPanel,
            contentPanel,
            titleLabel,
            colorScheme,
            panels: {},
            components: {},
            timers: [],
            tableModels: {},

            show: function () {
                SwingUtilities.invokeLater(function () {
                    frame.setVisible(true);
                });
                return this;
            },

            hide: function () {
                SwingUtilities.invokeLater(function () {
                    frame.setVisible(false);
                });
                return this;
            },

            toggle: function () {
                SwingUtilities.invokeLater(function () {
                    frame.setVisible(!frame.isVisible());
                });
                return this;
            },

            dispose: function () {
                this.timers.forEach(timer => {
                    if (timer && timer.isRunning()) {
                        timer.stop();
                    }
                });

                SwingUtilities.invokeLater(function () {
                    frame.dispose();
                });

                delete SwingUtils.windows[id];
                return this;
            },

            /**
             * Sets the window title
             * @param {string} newTitle - New window title
             */
            setTitle: function (newTitle) {
                SwingUtilities.invokeLater(function () {
                    titleLabel.setText(newTitle);
                });
                return this;
            },

            /**
             * Creates a panel in the window's content area
             * @param {Object} panelOptions - Panel configuration
             * @param {string} panelOptions.id - Unique identifier for the panel
             * @param {string} [panelOptions.title] - Optional title for the panel
             * @param {string} [panelOptions.layout="grid"] - Layout type: "border", "flow", "grid"
             * @param {Object} [panelOptions.layoutOptions] - Layout-specific options
             * @param {string} [panelOptions.position="center"] - Position in parent (for BorderLayout)
             * @param {Object} [panelOptions.parent] - Parent panel ID or null for main content
             * @param {boolean} [panelOptions.visible=true] - Whether the panel is initially visible
             * @returns {JPanel} Created panel
             */
            createPanel: function (panelOptions) {
                const panelId = panelOptions.id;
                const panelTitle = panelOptions.title;
                let layoutType = panelOptions.layout || "grid";
                const layoutOptions = panelOptions.layoutOptions || {};
                const position = panelOptions.position || BorderLayout.CENTER;
                const parentId = panelOptions.parent;
                const visible = panelOptions.visible !== false;

                const panel = new JPanel();

                // Extract number of columns if specified in layout string (e.g., "grid,2")
                let cols = 1;
                if (layoutType && layoutType.includes(",")) {
                    const parts = layoutType.split(",");
                    layoutType = parts[0];
                    cols = parseInt(parts[1]) || 1;
                }

                if (layoutType === "border") {
                    panel.setLayout(new BorderLayout(
                        layoutOptions.hgap || 0,
                        layoutOptions.vgap || 0
                    ));
                } else if (layoutType === "flow") {
                    panel.setLayout(new FlowLayout(
                        layoutOptions.align || FlowLayout.CENTER,
                        layoutOptions.hgap || 5,
                        layoutOptions.vgap || 5
                    ));
                } else if (layoutType === "grid") {
                    panel.setLayout(new GridLayout(
                        layoutOptions.rows || 1,
                        layoutOptions.cols || cols,
                        layoutOptions.hgap || 2,
                        layoutOptions.vgap || 2
                    ));
                } else if (layoutType === "gridbag") {
                    panel.setLayout(new GridBagLayout());
                } else if (layoutType === "card") {
                    panel.setLayout(new java.awt.CardLayout());
                }

                panel.setBackground(new Color(
                    colorScheme.panelBackground.getRed(),
                    colorScheme.panelBackground.getGreen(),
                    colorScheme.panelBackground.getBlue(),
                    colorScheme.panelBackground.getAlpha()
                ));

                if (panelTitle) {
                    const titledBorder = BorderFactory.createTitledBorder(
                        BorderFactory.createLineBorder(colorScheme.border, 1),
                        panelTitle,
                        TitledBorder.CENTER,
                        TitledBorder.TOP,
                        new Font("Dialog", Font.BOLD, 11),
                        colorScheme.text
                    );
                    panel.setBorder(BorderFactory.createCompoundBorder(
                        titledBorder,
                        BorderFactory.createEmptyBorder(5, 5, 5, 5)
                    ));
                } else {
                    panel.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
                }

                panel.setVisible(visible);

                if (parentId && this.panels[parentId]) {
                    this.panels[parentId].add(panel, position);
                } else {
                    this.contentPanel.add(panel, position);
                }

                this.panels[panelId] = panel;

                return panel;
            },

            /**
             * Creates a label in a panel
             * @param {Object} labelOptions - Label configuration
             * @param {string} labelOptions.id - Unique identifier for the label
             * @param {string} labelOptions.text - Label text
             * @param {string} labelOptions.parent - Parent panel ID
             * @param {string} [labelOptions.position=""] - Position in parent (for BorderLayout)
             * @param {string|Object} [labelOptions.font] - Font options as string "bold,16" or object
             * @param {Color} [labelOptions.color] - Text color
             * @param {number} [labelOptions.align=SwingConstants.LEFT] - Text alignment
             * @param {string} [labelOptions.region=""] - Region for BorderLayout
             * @returns {JLabel} Created label
             */
            createLabel: function (labelOptions) {
                const labelId = labelOptions.id;
                const text = labelOptions.text || "";
                const panelId = labelOptions.parent;
                const position = labelOptions.position || "";
                const color = labelOptions.color || colorScheme.text;
                const align = labelOptions.align || SwingConstants.LEFT;
                const region = labelOptions.region || position;

                const label = new JLabel(text, align);
                label.setForeground(color);

                // Handle font options as either string or object
                if (labelOptions.font) {
                    if (typeof labelOptions.font === 'string') {
                        const fontParts = labelOptions.font.split(',');
                        const fontStyle = fontParts[0] === 'bold' ? Font.BOLD : Font.PLAIN;
                        const fontSize = fontParts.length > 1 ? parseInt(fontParts[1]) : 11;
                        label.setFont(new Font("Dialog", fontStyle, fontSize));
                    } else {
                        const fontFamily = labelOptions.font.family || "Dialog";
                        const fontStyle = labelOptions.font.style || Font.PLAIN;
                        const fontSize = labelOptions.font.size || 11;
                        label.setFont(new Font(fontFamily, fontStyle, fontSize));
                    }
                }

                if (this.panels[panelId]) {
                    if (this.panels[panelId].getLayout() instanceof BorderLayout) {
                        this.panels[panelId].add(label, region);
                    } else {
                        this.panels[panelId].add(label);
                    }
                }

                this.components[labelId] = label;

                return label;
            },

            /**
             * Creates a button in a panel
             * @param {Object} buttonOptions - Button configuration
             * @param {string} buttonOptions.id - Unique identifier for the button
             * @param {string} buttonOptions.text - Button text
             * @param {string} buttonOptions.parent - Parent panel ID
             * @param {string} [buttonOptions.position=""] - Position in parent (for BorderLayout)
             * @param {Function} [buttonOptions.onClick] - Click event handler
             * @param {string} [buttonOptions.region=""] - Region for BorderLayout
             * @returns {JButton} Created button
             */
            createButton: function (buttonOptions) {
                const buttonId = buttonOptions.id;
                const text = buttonOptions.text || "Button";
                const panelId = buttonOptions.parent;
                const position = buttonOptions.position || "";
                const onClick = buttonOptions.onClick || function () { };
                const region = buttonOptions.region || position;

                const button = new JButton(text);

                const actionListener = Java.extend(ActionListener, {
                    actionPerformed: function (e) {
                        try {
                            onClick(e);
                        } catch (err) {
                            console.error("Error in button click handler: " + err.message);
                        }
                    }
                });
                button.addActionListener(new actionListener());

                if (this.panels[panelId]) {
                    if (this.panels[panelId].getLayout() instanceof BorderLayout) {
                        this.panels[panelId].add(button, region);
                    } else {
                        this.panels[panelId].add(button);
                    }
                }

                this.components[buttonId] = button;

                return button;
            },

            /**
             * Creates a checkbox in a panel
             * @param {Object} checkboxOptions - Checkbox configuration
             * @param {string} checkboxOptions.id - Unique identifier for the checkbox
             * @param {string} checkboxOptions.text - Checkbox text
             * @param {string} checkboxOptions.parent - Parent panel ID
             * @param {boolean} [checkboxOptions.selected=false] - Initial selection state
             * @param {Function} [checkboxOptions.onChange] - Change event handler
             * @returns {JCheckBox} Created checkbox
             */
            createCheckbox: function (checkboxOptions) {
                const checkboxId = checkboxOptions.id;
                const text = checkboxOptions.text || "";
                const panelId = checkboxOptions.parent;
                const selected = checkboxOptions.selected || false;
                const onChange = checkboxOptions.onChange || function () { };

                const checkbox = new JCheckBox(text, selected);
                checkbox.setForeground(colorScheme.text);
                checkbox.setBackground(new Color(0, 0, 0, 0));

                const actionListener = Java.extend(ActionListener, {
                    actionPerformed: function (e) {
                        try {
                            onChange(checkbox.isSelected());
                        } catch (err) {
                            console.error("Error in checkbox change handler: " + err.message);
                        }
                    }
                });
                checkbox.addActionListener(new actionListener());

                if (this.panels[panelId]) {
                    this.panels[panelId].add(checkbox);
                }

                this.components[checkboxId] = checkbox;

                return checkbox;
            },

            /**
             * Creates a dropdown (combo box) in a panel
             * @param {Object} comboOptions - Combo box configuration
             * @param {string} comboOptions.id - Unique identifier for the combo box
             * @param {Array} comboOptions.items - Array of items to display
             * @param {string} comboOptions.parent - Parent panel ID
             * @param {number} [comboOptions.selected=0] - Initial selected index
             * @param {Function} [comboOptions.onChange] - Change event handler
             * @returns {JComboBox} Created combo box
             */
            createComboBox: function (comboOptions) {
                const comboId = comboOptions.id;
                const items = comboOptions.items || [];
                const panelId = comboOptions.parent;
                const selected = comboOptions.selected || 0;
                const onChange = comboOptions.onChange || function () { };

                const combo = new JComboBox();

                items.forEach(item => {
                    combo.addItem(item);
                });

                if (selected >= 0 && selected < items.length) {
                    combo.setSelectedIndex(selected);
                }

                const actionListener = Java.extend(ActionListener, {
                    actionPerformed: function (e) {
                        try {
                            onChange(combo.getSelectedItem(), combo.getSelectedIndex());
                        } catch (err) {
                            console.error("Error in combo box change handler: " + err.message);
                        }
                    }
                });
                combo.addActionListener(new actionListener());

                if (this.panels[panelId]) {
                    this.panels[panelId].add(combo);
                }

                this.components[comboId] = combo;

                return combo;
            },

            /**
             * Creates a progress bar in a panel
             * @param {Object} progressOptions - Progress bar configuration
             * @param {string} progressOptions.id - Unique identifier for the progress bar
             * @param {string} progressOptions.parent - Parent panel ID
             * @param {number} [progressOptions.min=0] - Minimum value
             * @param {number} [progressOptions.max=100] - Maximum value
             * @param {number} [progressOptions.value=0] - Initial value
             * @param {boolean} [progressOptions.showText=true] - Whether to show progress text
             * @returns {JProgressBar} Created progress bar
             */
            createProgressBar: function (progressOptions) {
                const progressId = progressOptions.id;
                const panelId = progressOptions.parent;
                const min = progressOptions.min || 0;
                const max = progressOptions.max || 100;
                const value = progressOptions.value || 0;
                const showText = progressOptions.showText !== false;

                const progressBar = new JProgressBar(min, max);
                progressBar.setValue(value);
                progressBar.setStringPainted(showText);

                if (this.panels[panelId]) {
                    this.panels[panelId].add(progressBar);
                }

                this.components[progressId] = progressBar;

                return progressBar;
            },

            /**
             * Creates a text area in a panel
             * @param {Object} textAreaOptions - Text area configuration
             * @param {string} textAreaOptions.id - Unique identifier for the text area
             * @param {string} textAreaOptions.parent - Parent panel ID
             * @param {string} [textAreaOptions.text=""] - Initial text
             * @param {number} [textAreaOptions.rows=5] - Number of rows
             * @param {number} [textAreaOptions.cols=20] - Number of columns
             * @param {boolean} [textAreaOptions.editable=true] - Whether the text area is editable
             * @param {boolean} [textAreaOptions.scrollable=true] - Whether to add scroll bars
             * @returns {JTextArea|JScrollPane} Created text area or scroll pane containing text area
             */
            createTextArea: function (textAreaOptions) {
                const textAreaId = textAreaOptions.id;
                const panelId = textAreaOptions.parent;
                const text = textAreaOptions.text || "";
                const rows = textAreaOptions.rows || 5;
                const cols = textAreaOptions.cols || 20;
                const editable = textAreaOptions.editable !== false;
                const scrollable = textAreaOptions.scrollable !== false;

                const textArea = new JTextArea(text, rows, cols);
                textArea.setEditable(editable);
                textArea.setForeground(colorScheme.text);
                textArea.setBackground(new Color(
                    colorScheme.background.getRed(),
                    colorScheme.background.getGreen(),
                    colorScheme.background.getBlue(),
                    230
                ));

                let component;
                if (scrollable) {
                    component = new JScrollPane(textArea);
                    component.setPreferredSize(new Dimension(cols * 8, rows * 16));
                } else {
                    component = textArea;
                }

                if (this.panels[panelId]) {
                    this.panels[panelId].add(component);
                }

                this.components[textAreaId] = textArea;

                return component;
            },

            /**
             * Creates a text field in a panel
             * @param {Object} textFieldOptions - Text field configuration
             * @param {string} textFieldOptions.id - Unique identifier for the text field
             * @param {string} textFieldOptions.parent - Parent panel ID
             * @param {string} [textFieldOptions.text=""] - Initial text
             * @param {number} [textFieldOptions.columns=10] - Number of columns
             * @param {Function} [textFieldOptions.onChange] - Change event handler
             * @returns {JTextField} Created text field
             */
            createTextField: function (textFieldOptions) {
                const textFieldId = textFieldOptions.id;
                const panelId = textFieldOptions.parent;
                const text = textFieldOptions.text || "";
                const columns = textFieldOptions.columns || 10;
                const onChange = textFieldOptions.onChange || function () { };

                const textField = new JTextField(text, columns);
                textField.setForeground(colorScheme.text);
                textField.setBackground(new Color(
                    colorScheme.background.getRed(),
                    colorScheme.background.getGreen(),
                    colorScheme.background.getBlue(),
                    230
                ));

                if (onChange) {
                    const documentListener = Java.extend(javax.swing.event.DocumentListener, {
                        insertUpdate: function (e) { onChange(textField.getText()); },
                        removeUpdate: function (e) { onChange(textField.getText()); },
                        changedUpdate: function (e) { onChange(textField.getText()); }
                    });
                    textField.getDocument().addDocumentListener(new documentListener());
                }

                if (this.panels[panelId]) {
                    this.panels[panelId].add(textField);
                }

                this.components[textFieldId] = textField;

                return textField;
            },

            /**
             * Creates a slider in a panel
             * @param {Object} sliderOptions - Slider configuration
             * @param {string} sliderOptions.id - Unique identifier for the slider
             * @param {string} sliderOptions.parent - Parent panel ID
             * @param {number} [sliderOptions.min=0] - Minimum value
             * @param {number} [sliderOptions.max=100] - Maximum value
             * @param {number} [sliderOptions.value=50] - Initial value
             * @param {Function} [sliderOptions.onChange] - Change event handler
             * @param {boolean} [sliderOptions.paintLabels=false] - Whether to paint labels
             * @param {boolean} [sliderOptions.paintTicks=false] - Whether to paint ticks
             * @param {number} [sliderOptions.majorTickSpacing=10] - Spacing between major ticks
             * @param {number} [sliderOptions.minorTickSpacing=5] - Spacing between minor ticks
             * @returns {JSlider} Created slider
             */
            createSlider: function (sliderOptions) {
                const sliderId = sliderOptions.id;
                const panelId = sliderOptions.parent;
                const min = sliderOptions.min || 0;
                const max = sliderOptions.max || 100;
                const value = sliderOptions.value || 50;
                const onChange = sliderOptions.onChange || function () { };
                const paintLabels = sliderOptions.paintLabels || false;
                const paintTicks = sliderOptions.paintTicks || false;
                const majorTickSpacing = sliderOptions.majorTickSpacing || 10;
                const minorTickSpacing = sliderOptions.minorTickSpacing || 5;

                const slider = new JSlider(JSlider.HORIZONTAL, min, max, value);

                if (paintTicks) {
                    slider.setPaintTicks(true);
                    slider.setMajorTickSpacing(majorTickSpacing);
                    slider.setMinorTickSpacing(minorTickSpacing);
                }

                if (paintLabels) {
                    slider.setPaintLabels(true);

                    // Create custom labels if provided
                    if (sliderOptions.labels) {
                        const labelTable = new Hashtable();
                        for (const [value, label] of Object.entries(sliderOptions.labels)) {
                            labelTable.put(parseInt(value), new JLabel(label));
                        }
                        slider.setLabelTable(labelTable);
                    }
                }

                const changeListener = Java.extend(ChangeListener, {
                    stateChanged: function (e) {
                        try {
                            if (!slider.getValueIsAdjusting() || sliderOptions.continuous) {
                                onChange(slider.getValue());
                            }
                        } catch (err) {
                            console.error("Error in slider change handler: " + err.message);
                        }
                    }
                });
                slider.addChangeListener(new changeListener());

                if (this.panels[panelId]) {
                    this.panels[panelId].add(slider);
                }

                this.components[sliderId] = slider;

                return slider;
            },

            /**
             * Creates a separator in a panel
             * @param {Object} separatorOptions - Separator configuration
             * @param {string} separatorOptions.id - Unique identifier for the separator
             * @param {string} separatorOptions.parent - Parent panel ID
             * @param {boolean} [separatorOptions.horizontal=true] - Orientation
             * @returns {JSeparator} Created separator
             */
            createSeparator: function (separatorOptions) {
                const separatorId = separatorOptions.id;
                const panelId = separatorOptions.parent;
                const horizontal = separatorOptions.horizontal !== false;

                const orientation = horizontal ? JSeparator.HORIZONTAL : JSeparator.VERTICAL;
                const separator = new JSeparator(orientation);

                if (this.panels[panelId]) {
                    this.panels[panelId].add(separator);
                }

                this.components[separatorId] = separator;

                return separator;
            },

            /**
             * Creates a table in a panel
             * @param {Object} tableOptions - Table configuration
             * @param {string} tableOptions.id - Unique identifier for the table
             * @param {string} tableOptions.parent - Parent panel ID
             * @param {Array<string>} tableOptions.headers - Column headers
             * @param {Array<Array>} [tableOptions.rows=[]] - Initial data rows
             * @param {boolean} [tableOptions.editable=false] - Whether the table is editable
             * @param {boolean} [tableOptions.sortable=false] - Whether the table is sortable
             * @param {boolean} [tableOptions.selectable=true] - Whether rows can be selected
             * @param {string} [tableOptions.region=""] - Region for BorderLayout
             * @returns {JScrollPane} Scroll pane containing the created table
             */
            createTable: function (tableOptions) {
                const tableId = tableOptions.id;
                const panelId = tableOptions.parent;
                const headers = tableOptions.headers || [];
                const rows = tableOptions.rows || [];
                const editable = tableOptions.editable || false;
                const sortable = tableOptions.sortable || false;
                const selectable = tableOptions.selectable !== false;
                const region = tableOptions.region || "";

                // Create a custom table model if not editable
                let tableModel;

                if (!editable) {
                    // Create a non-editable model by extending DefaultTableModel
                    const CustomTableModel = Java.extend(DefaultTableModel, {
                        isCellEditable: function () {
                            return false;
                        }
                    });

                    tableModel = new CustomTableModel(
                        new Array(rows.length).fill(null).map((_, rowIndex) =>
                            new Array(headers.length).fill(null).map((_, colIndex) =>
                                rows[rowIndex] && rows[rowIndex][colIndex] ? rows[rowIndex][colIndex] : ""
                            )
                        ),
                        headers
                    );
                } else {
                    // Use standard DefaultTableModel for editable tables
                    tableModel = new DefaultTableModel(
                        new Array(rows.length).fill(null).map((_, rowIndex) =>
                            new Array(headers.length).fill(null).map((_, colIndex) =>
                                rows[rowIndex] && rows[rowIndex][colIndex] ? rows[rowIndex][colIndex] : ""
                            )
                        ),
                        headers
                    );
                }

                // Create the table
                const table = new JTable(tableModel);
                table.setAutoResizeMode(JTable.AUTO_RESIZE_ALL_COLUMNS);

                // Handle editability
                table.setEnabled(true);

                // Handle selection
                if (!selectable) {
                    table.setRowSelectionAllowed(false);
                    table.setCellSelectionEnabled(false);
                } else {
                    table.setRowSelectionAllowed(true);
                    table.setSelectionMode(javax.swing.ListSelectionModel.SINGLE_SELECTION);
                }

                // Handle sorting
                if (sortable) {
                    table.setAutoCreateRowSorter(true);
                }

                // Customize appearance
                table.setGridColor(new Color(colorScheme.border.getRGB()));
                table.setBackground(new Color(
                    colorScheme.background.getRed(),
                    colorScheme.background.getGreen(),
                    colorScheme.background.getBlue(),
                    230
                ));
                table.setForeground(colorScheme.text);

                // Style the header
                const tableHeader = table.getTableHeader();
                tableHeader.setBackground(colorScheme.headerBackground);
                tableHeader.setForeground(colorScheme.text);

                // Create scrollpane for the table
                const scrollPane = new JScrollPane(table);
                scrollPane.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
                scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_AS_NEEDED);

                // Add to parent panel
                if (this.panels[panelId]) {
                    if (this.panels[panelId].getLayout() instanceof BorderLayout) {
                        // Make sure we're using a valid BorderLayout constraint
                        const borderLayout = Java.type("java.awt.BorderLayout");
                        let constraint;

                        // Map string position to BorderLayout constant
                        switch (region) {
                            case "CENTER":
                            case "center":
                                constraint = borderLayout.CENTER;
                                break;
                            case "NORTH":
                            case "north":
                                constraint = borderLayout.NORTH;
                                break;
                            case "SOUTH":
                            case "south":
                                constraint = borderLayout.SOUTH;
                                break;
                            case "EAST":
                            case "east":
                                constraint = borderLayout.EAST;
                                break;
                            case "WEST":
                            case "west":
                                constraint = borderLayout.WEST;
                                break;
                            default:
                                // Default to CENTER if not recognized
                                constraint = borderLayout.CENTER;
                        }

                        this.panels[panelId].add(scrollPane, constraint);
                    } else {
                        this.panels[panelId].add(scrollPane);
                    }
                }

                // Store references
                this.components[tableId] = table;
                this.tableModels[tableId] = tableModel;

                return scrollPane;
            },

            /**
             * Creates a tabbed pane in a panel
             * @param {Object} tabbedPaneOptions - Tabbed pane configuration
             * @param {string} tabbedPaneOptions.id - Unique identifier for the tabbed pane
             * @param {string} tabbedPaneOptions.parent - Parent panel ID
             * @param {Array<Object>} [tabbedPaneOptions.tabs=[]] - Initial tabs [{title, content}]
             * @param {Function} [tabbedPaneOptions.onTabChange] - Tab change event handler
             * @param {string} [tabbedPaneOptions.tabPlacement="top"] - Tab placement (top, bottom, left, right)
             * @param {string} [tabbedPaneOptions.region=""] - Region for BorderLayout
             * @returns {JTabbedPane} Created tabbed pane
             */
            createTabbedPane: function (tabbedPaneOptions) {
                const tabbedPaneId = tabbedPaneOptions.id;
                const panelId = tabbedPaneOptions.parent;
                const tabs = tabbedPaneOptions.tabs || [];
                const onTabChange = tabbedPaneOptions.onTabChange || function () { };
                const region = tabbedPaneOptions.region || BorderLayout.CENTER; // Default to CENTER

                // Create the tabbed pane with a hardcoded value
                const tabbedPane = new JTabbedPane(1); // TOP = 1

                // Add initial tabs if provided
                if (Array.isArray(tabs)) {
                    tabs.forEach(tab => {
                        if (tab && typeof tab === 'object') {
                            const panel = new JPanel(new BorderLayout());
                            panel.setBackground(colorScheme.panelBackground);

                            if (tab.content) {
                                panel.add(tab.content, BorderLayout.CENTER);
                            }

                            tabbedPane.addTab(tab.title || "Tab", panel);
                        }
                    });
                }

                // Add change listener
                const changeListener = Java.extend(ChangeListener, {
                    stateChanged: function (e) {
                        try {
                            if (tabbedPane.getSelectedIndex() >= 0) {
                                onTabChange(tabbedPane.getSelectedIndex(), tabbedPane.getTitleAt(tabbedPane.getSelectedIndex()));
                            }
                        } catch (err) {
                            console.error("Error in tabbed pane change handler: " + err.message);
                        }
                    }
                });
                tabbedPane.addChangeListener(new changeListener());

                // Add to parent panel
                if (this.panels[panelId]) {
                    if (this.panels[panelId].getLayout() instanceof BorderLayout) {
                        // Make sure we're using a valid BorderLayout constraint
                        const borderLayout = Java.type("java.awt.BorderLayout");
                        let constraint;

                        // Map string position to BorderLayout constant
                        switch (region) {
                            case "CENTER":
                            case "center":
                                constraint = borderLayout.CENTER;
                                break;
                            case "NORTH":
                            case "north":
                                constraint = borderLayout.NORTH;
                                break;
                            case "SOUTH":
                            case "south":
                                constraint = borderLayout.SOUTH;
                                break;
                            case "EAST":
                            case "east":
                                constraint = borderLayout.EAST;
                                break;
                            case "WEST":
                            case "west":
                                constraint = borderLayout.WEST;
                                break;
                            default:
                                // Default to CENTER if not recognized
                                constraint = borderLayout.CENTER;
                        }

                        this.panels[panelId].add(tabbedPane, constraint);
                    } else {
                        this.panels[panelId].add(tabbedPane);
                    }
                }

                this.components[tabbedPaneId] = tabbedPane;

                return tabbedPane;
            },

            /**
             * Adds a tab to a tabbed pane
             * @param {string} tabbedPaneId - ID of the tabbed pane
             * @param {string} title - Tab title
             * @param {JComponent} content - Tab content
             * @param {boolean} [select=false] - Whether to select the new tab
             * @returns {number} Index of the added tab
             */
            addTab: function (tabbedPaneId, title, content, select) {
                const tabbedPane = this.components[tabbedPaneId];
                if (!tabbedPane || !(tabbedPane instanceof JTabbedPane)) {
                    console.error("Tabbed pane not found with ID: " + tabbedPaneId);
                    return -1;
                }

                const panel = new JPanel(new BorderLayout());
                panel.setBackground(colorScheme.panelBackground);

                if (content) {
                    panel.add(content, BorderLayout.CENTER);
                }

                tabbedPane.addTab(title, panel);

                if (select) {
                    tabbedPane.setSelectedIndex(tabbedPane.getTabCount() - 1);
                }

                return tabbedPane.getTabCount() - 1;
            },

            /**
             * Gets the selected row index in a table
             * @param {string} tableId - Table ID
             * @returns {number} Selected row index or -1 if no selection
             */
            getSelectedRow: function (tableId) {
                const table = this.components[tableId];
                if (!table || !(table instanceof JTable)) {
                    console.error("Table not found with ID: " + tableId);
                    return -1;
                }

                return table.getSelectedRow();
            },

            /**
             * Updates a table with new data
             * @param {string} tableId - Table ID
             * @param {Array<Array>} rows - New data rows
             */
            updateTable: function (tableId, rows) {
                const table = this.components[tableId];
                const tableModel = this.tableModels[tableId];

                if (!table || !tableModel) {
                    console.error("Table or model not found with ID: " + tableId);
                    return;
                }

                SwingUtilities.invokeLater(function () {
                    try {
                        // Clear existing data
                        tableModel.setRowCount(0);

                        // Add new rows
                        rows.forEach(row => {
                            tableModel.addRow(row);
                        });

                        // Refresh the table
                        table.repaint();
                    } catch (err) {
                        console.error("Error updating table: " + err.message);
                    }
                });

                return this;
            },

            /**
             * Gets the component with the specified ID
             * @param {string} id - Component ID
             * @returns {Object} The component or null if not found
             */
            getComponent: function (id) {
                return this.components[id] || null;
            },

            /**
             * Updates a component's text or value
             * @param {string} id - Component ID
             * @param {Object} options - Properties to update
             */
            updateComponent: function (id, options) {
                const component = this.components[id];
                if (!component) return;

                SwingUtilities.invokeLater(function () {
                    try {
                        if (options.text !== undefined && component.setText) {
                            component.setText(String(options.text));
                        }

                        if (options.value !== undefined && component.setValue) {
                            component.setValue(Number(options.value));
                        }

                        if (options.selected !== undefined && component.setSelected) {
                            component.setSelected(Boolean(options.selected));
                        }

                        if (options.enabled !== undefined && component.setEnabled) {
                            component.setEnabled(Boolean(options.enabled));
                        }

                        if (options.visible !== undefined && component.setVisible) {
                            component.setVisible(Boolean(options.visible));
                        }

                        if (options.foreground !== undefined && component.setForeground) {
                            component.setForeground(options.foreground);
                        }

                        if (options.background !== undefined && component.setBackground) {
                            component.setBackground(options.background);
                        }
                    } catch (err) {
                        console.error("Error updating component: " + err.message);
                    }
                });

                return this;
            },

            /**
             * Updates a panel's title
             * @param {string} id - Panel ID
             * @param {string} title - New title
             */
            updatePanelTitle: function (id, title) {
                const panel = this.panels[id];
                if (!panel) return;

                SwingUtilities.invokeLater(function () {
                    try {
                        const border = panel.getBorder();
                        if (border instanceof TitledBorder) {
                            border.setTitle(title);
                            panel.repaint();
                        }
                    } catch (err) {
                        console.error("Error updating panel title: " + err.message);
                    }
                });

                return this;
            },

            /**
             * Creates a timer for periodic updates
             * @param {Object} timerOptions - Timer configuration
             * @param {number} timerOptions.interval - Update interval in milliseconds
             * @param {Function} timerOptions.callback - Callback function for updates
             * @param {boolean} [timerOptions.autoStart=true] - Whether to auto-start the timer
             * @returns {Timer} Created timer
             */
            createTimer: function (timerOptions) {
                const interval = timerOptions.interval || 1000;
                const callback = timerOptions.callback || function () { };
                const autoStart = timerOptions.autoStart !== false;

                const timerListener = Java.extend(ActionListener, {
                    actionPerformed: function (e) {
                        try {
                            callback();
                        } catch (err) {
                            console.error("Error in timer callback: " + err.message);
                        }
                    }
                });

                const timer = new Timer(interval, new timerListener());

                this.timers.push(timer);

                if (autoStart) {
                    timer.start();
                }

                return timer;
            },

            /**
             * Highlight a component for attention
             * @param {string} id - Component ID
             * @param {Color} [color] - Highlight color (defaults to accent color)
             * @param {number} [duration=1000] - Duration in milliseconds
             */
            highlightComponent: function (id, color, duration) {
                const component = this.components[id];
                if (!component) return;

                const highlightColor = color || colorScheme.accent;
                const highlightDuration = duration || 1000;
                const originalBackground = component.getBackground();

                SwingUtilities.invokeLater(function () {
                    component.setBackground(highlightColor);

                    const timer = new Timer(highlightDuration, new Java.extend(ActionListener, {
                        actionPerformed: function (e) {
                            component.setBackground(originalBackground);
                            timer.stop();
                        }
                    }));
                    timer.setRepeats(false);
                    timer.start();
                });

                return this;
            },

            /**
             * Updates panel background color
             * @param {string} id - Panel ID
             * @param {Color} color - New background color
             */
            updatePanelColor: function (id, color) {
                const panel = this.panels[id];
                if (!panel) return;

                SwingUtilities.invokeLater(function () {
                    panel.setBackground(color);
                    panel.repaint();
                });

                return this;
            },

            /**
             * Close the window
             */
            close: function () {
                this.hide();
                this.dispose();
            }
        };

        this.windows[id] = windowObj;

        return windowObj;
    }

    /**
     * Creates a dialog window
     * @param {Object} options - Dialog configuration
     * @param {string} options.id - Unique identifier for the dialog
     * @param {string} options.title - Dialog title
     * @param {Object} [options.colorScheme] - Color scheme to use
     * @param {number} [options.width=300] - Width of the dialog
     * @param {number} [options.height=200] - Height of the dialog
     * @param {boolean} [options.modal=true] - Whether the dialog is modal
     * @param {boolean} [options.resizable=false] - Whether the dialog is resizable
     * @param {Function} [options.onClose] - Callback when dialog is closed
     * @returns {Object} Created dialog object with similar methods to window
     */
    static createDialog(options) {
        if (!options || !options.id) {
            throw new Error("Dialog ID is required");
        }

        if (this.windows[options.id]) {
            return this.windows[options.id];
        }

        const id = options.id;
        const title = options.title || "Dialog";
        const colorScheme = options.colorScheme || this.ColorSchemes.DARK;
        const width = options.width || 300;
        const height = options.height || 200;
        const modal = options.modal !== false;
        const resizable = options.resizable || false;
        const onClose = options.onClose || function () { };

        // Create a parent frame if none exists (needed for modality)
        let parentFrame = null;
        if (modal) {
            for (const windowId in this.windows) {
                const window = this.windows[windowId];
                if (window.frame && window.frame.isVisible()) {
                    parentFrame = window.frame;
                    break;
                }
            }

            if (!parentFrame) {
                parentFrame = new JFrame();
            }
        }

        const dialog = new JDialog(parentFrame, title, modal);
        dialog.setUndecorated(false);
        dialog.setDefaultCloseOperation(JDialog.DISPOSE_ON_CLOSE);
        dialog.setResizable(resizable);

        const mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout());
        mainPanel.setBackground(colorScheme.background);
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        const contentPanel = new JPanel();
        contentPanel.setLayout(new BorderLayout());
        contentPanel.setBackground(colorScheme.panelBackground);
        contentPanel.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));

        mainPanel.add(contentPanel, BorderLayout.CENTER);
        dialog.getContentPane().add(mainPanel);

        dialog.setSize(width, height);
        dialog.setLocationRelativeTo(null);

        dialog.addWindowListener(new Java.extend(java.awt.event.WindowAdapter, {
            windowClosing: function (e) {
                try {
                    onClose();
                } catch (err) {
                    console.error("Error in dialog close handler: " + err.message);
                }
            }
        }));

        const dialogObj = {
            id,
            dialog,
            mainPanel,
            contentPanel,
            colorScheme,
            panels: {},
            components: {},
            timers: [],
            tableModels: {},

            show: function () {
                SwingUtilities.invokeLater(function () {
                    dialog.setVisible(true);
                });
                return this;
            },

            hide: function () {
                SwingUtilities.invokeLater(function () {
                    dialog.setVisible(false);
                });
                return this;
            },

            close: function () {
                SwingUtilities.invokeLater(function () {
                    dialog.dispose();
                });

                this.timers.forEach(timer => {
                    if (timer && timer.isRunning()) {
                        timer.stop();
                    }
                });

                delete SwingUtils.windows[id];
                return this;
            },

            // Implementation of all the same methods as window
            createPanel: function (panelOptions) {
                const panelId = panelOptions.id;
                const panelTitle = panelOptions.title;
                let layoutType = panelOptions.layout || "grid";
                const layoutOptions = panelOptions.layoutOptions || {};
                const position = panelOptions.position || BorderLayout.CENTER;
                const parentId = panelOptions.parent;
                const visible = panelOptions.visible !== false;

                const panel = new JPanel();

                // Extract number of columns if specified in layout string (e.g., "grid,2")
                let cols = 1;
                if (layoutType && layoutType.includes(",")) {
                    const parts = layoutType.split(",");
                    layoutType = parts[0];
                    cols = parseInt(parts[1]) || 1;
                }

                if (layoutType === "border") {
                    panel.setLayout(new BorderLayout(
                        layoutOptions.hgap || 0,
                        layoutOptions.vgap || 0
                    ));
                } else if (layoutType === "flow") {
                    panel.setLayout(new FlowLayout(
                        layoutOptions.align || FlowLayout.CENTER,
                        layoutOptions.hgap || 5,
                        layoutOptions.vgap || 5
                    ));
                } else if (layoutType === "grid") {
                    panel.setLayout(new GridLayout(
                        layoutOptions.rows || 1,
                        layoutOptions.cols || cols,
                        layoutOptions.hgap || 2,
                        layoutOptions.vgap || 2
                    ));
                } else if (layoutType === "gridbag") {
                    panel.setLayout(new GridBagLayout());
                } else if (layoutType === "card") {
                    panel.setLayout(new java.awt.CardLayout());
                }

                panel.setBackground(new Color(
                    colorScheme.panelBackground.getRed(),
                    colorScheme.panelBackground.getGreen(),
                    colorScheme.panelBackground.getBlue(),
                    colorScheme.panelBackground.getAlpha()
                ));

                if (panelTitle) {
                    const titledBorder = BorderFactory.createTitledBorder(
                        BorderFactory.createLineBorder(colorScheme.border, 1),
                        panelTitle,
                        TitledBorder.CENTER,
                        TitledBorder.TOP,
                        new Font("Dialog", Font.BOLD, 11),
                        colorScheme.text
                    );
                    panel.setBorder(BorderFactory.createCompoundBorder(
                        titledBorder,
                        BorderFactory.createEmptyBorder(5, 5, 5, 5)
                    ));
                } else {
                    panel.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));
                }

                panel.setVisible(visible);

                if (parentId && this.panels[parentId]) {
                    this.panels[parentId].add(panel, position);
                } else {
                    this.contentPanel.add(panel, position);
                }

                this.panels[panelId] = panel;

                return panel;
            },

            createLabel: function (labelOptions) {
                const labelId = labelOptions.id;
                const text = labelOptions.text || "";
                const panelId = labelOptions.parent;
                const position = labelOptions.position || "";
                const color = labelOptions.color || colorScheme.text;
                const align = labelOptions.align || SwingConstants.LEFT;

                const label = new JLabel(text, align);
                label.setForeground(color);

                // Handle font options
                if (labelOptions.font) {
                    if (typeof labelOptions.font === 'string') {
                        const fontParts = labelOptions.font.split(',');
                        const fontStyle = fontParts[0] === 'bold' ? Font.BOLD : Font.PLAIN;
                        const fontSize = fontParts.length > 1 ? parseInt(fontParts[1]) : 11;
                        label.setFont(new Font("Dialog", fontStyle, fontSize));
                    } else {
                        const fontFamily = labelOptions.font.family || "Dialog";
                        const fontStyle = labelOptions.font.style || Font.PLAIN;
                        const fontSize = labelOptions.font.size || 11;
                        label.setFont(new Font(fontFamily, fontStyle, fontSize));
                    }
                }

                if (this.panels[panelId]) {
                    if (this.panels[panelId].getLayout() instanceof BorderLayout) {
                        this.panels[panelId].add(label, position);
                    } else {
                        this.panels[panelId].add(label);
                    }
                }

                this.components[labelId] = label;

                return label;
            },

            createButton: function (buttonOptions) {
                const buttonId = buttonOptions.id;
                const text = buttonOptions.text || "Button";
                const panelId = buttonOptions.parent;
                const position = buttonOptions.position || "";
                const onClick = buttonOptions.onClick || function () { };

                const button = new JButton(text);

                const actionListener = Java.extend(ActionListener, {
                    actionPerformed: function (e) {
                        try {
                            onClick(e);
                        } catch (err) {
                            console.error("Error in button click handler: " + err.message);
                        }
                    }
                });
                button.addActionListener(new actionListener());

                if (this.panels[panelId]) {
                    if (this.panels[panelId].getLayout() instanceof BorderLayout) {
                        this.panels[panelId].add(button, position);
                    } else {
                        this.panels[panelId].add(button);
                    }
                }

                this.components[buttonId] = button;

                return button;
            },

            createTextField: function (textFieldOptions) {
                const textFieldId = textFieldOptions.id;
                const text = textFieldOptions.text || "";
                const panelId = textFieldOptions.parent;
                const columns = textFieldOptions.columns || 10;
                const onChange = textFieldOptions.onChange || function () { };

                const textField = new JTextField(text, columns);
                textField.setForeground(colorScheme.text);
                textField.setBackground(new Color(
                    colorScheme.background.getRed(),
                    colorScheme.background.getGreen(),
                    colorScheme.background.getBlue(),
                    230
                ));

                if (onChange) {
                    const documentListener = Java.extend(javax.swing.event.DocumentListener, {
                        insertUpdate: function (e) { onChange(textField.getText()); },
                        removeUpdate: function (e) { onChange(textField.getText()); },
                        changedUpdate: function (e) { onChange(textField.getText()); }
                    });
                    textField.getDocument().addDocumentListener(new documentListener());
                }

                if (this.panels[panelId]) {
                    this.panels[panelId].add(textField);
                }

                this.components[textFieldId] = textField;

                return textField;
            },

            createTable: function (tableOptions) {
                const tableId = tableOptions.id;
                const panelId = tableOptions.parent;
                const headers = tableOptions.headers || [];
                const rows = tableOptions.rows || [];
                const editable = tableOptions.editable || false;
                const sortable = tableOptions.sortable || false;
                const selectable = tableOptions.selectable !== false;
                const region = tableOptions.region || "";

                // Create the table model
                const tableModel = new DefaultTableModel(
                    new Array(rows.length).fill(null).map((_, rowIndex) =>
                        new Array(headers.length).fill(null).map((_, colIndex) =>
                            rows[rowIndex] && rows[rowIndex][colIndex] ? rows[rowIndex][colIndex] : ""
                        )
                    ),
                    headers
                );

                // Create the table
                const table = new JTable(tableModel);
                table.setAutoResizeMode(JTable.AUTO_RESIZE_ALL_COLUMNS);

                // Handle editability
                table.setEnabled(true);
                if (!editable) {
                    const defaultTableModel = tableModel;
                    defaultTableModel.isCellEditable = function () { return false; };
                }

                // Handle selection
                if (!selectable) {
                    table.setRowSelectionAllowed(false);
                    table.setCellSelectionEnabled(false);
                } else {
                    table.setRowSelectionAllowed(true);
                    table.setSelectionMode(javax.swing.ListSelectionModel.SINGLE_SELECTION);
                }

                // Handle sorting
                if (sortable) {
                    table.setAutoCreateRowSorter(true);
                }

                // Customize appearance
                table.setGridColor(new Color(colorScheme.border.getRGB()));
                table.setBackground(new Color(
                    colorScheme.background.getRed(),
                    colorScheme.background.getGreen(),
                    colorScheme.background.getBlue(),
                    230
                ));
                table.setForeground(colorScheme.text);

                // Style the header
                const tableHeader = table.getTableHeader();
                tableHeader.setBackground(colorScheme.headerBackground);
                tableHeader.setForeground(colorScheme.text);

                // Create scrollpane for the table
                const scrollPane = new JScrollPane(table);
                scrollPane.setVerticalScrollBarPolicy(ScrollPaneConstants.VERTICAL_SCROLLBAR_AS_NEEDED);
                scrollPane.setHorizontalScrollBarPolicy(ScrollPaneConstants.HORIZONTAL_SCROLLBAR_AS_NEEDED);

                // Add to parent panel
                if (this.panels[panelId]) {
                    if (this.panels[panelId].getLayout() instanceof BorderLayout) {
                        this.panels[panelId].add(scrollPane, region);
                    } else {
                        this.panels[panelId].add(scrollPane);
                    }
                }

                // Store references
                this.components[tableId] = table;
                this.tableModels[tableId] = tableModel;

                return scrollPane;
            },

            updateTable: function (tableId, rows) {
                const table = this.components[tableId];
                const tableModel = this.tableModels[tableId];

                if (!table || !tableModel) {
                    console.error("Table or model not found with ID: " + tableId);
                    return;
                }

                SwingUtilities.invokeLater(function () {
                    try {
                        // Clear existing data
                        tableModel.setRowCount(0);

                        // Add new rows
                        rows.forEach(row => {
                            tableModel.addRow(row);
                        });

                        // Refresh the table
                        table.repaint();
                    } catch (err) {
                        console.error("Error updating table: " + err.message);
                    }
                });

                return this;
            },

            getSelectedRow: function (tableId) {
                const table = this.components[tableId];
                if (!table || !(table instanceof JTable)) {
                    console.error("Table not found with ID: " + tableId);
                    return -1;
                }

                return table.getSelectedRow();
            },

            getComponent: function (id) {
                return this.components[id] || null;
            },

            updateComponent: function (id, options) {
                const component = this.components[id];
                if (!component) return;

                SwingUtilities.invokeLater(function () {
                    try {
                        if (options.text !== undefined && component.setText) {
                            component.setText(String(options.text));
                        }

                        if (options.value !== undefined && component.setValue) {
                            component.setValue(Number(options.value));
                        }

                        if (options.selected !== undefined && component.setSelected) {
                            component.setSelected(Boolean(options.selected));
                        }

                        if (options.enabled !== undefined && component.setEnabled) {
                            component.setEnabled(Boolean(options.enabled));
                        }

                        if (options.visible !== undefined && component.setVisible) {
                            component.setVisible(Boolean(options.visible));
                        }
                    } catch (err) {
                        console.error("Error updating component: " + err.message);
                    }
                });

                return this;
            }
        };

        this.windows[id] = dialogObj;

        return dialogObj;
    }

    /**
     * Shows a message dialog
     * @param {string} message - Message to display
     * @param {string} [title="Message"] - Dialog title
     * @param {number} [messageType=JOptionPane.INFORMATION_MESSAGE] - Message type
     */
    static showMessageDialog(message, title = "Message", messageType = JOptionPane.INFORMATION_MESSAGE) {
        SwingUtilities.invokeLater(function () {
            JOptionPane.showMessageDialog(null, message, title, messageType);
        });
    }

    /**
     * Shows an error dialog
     * @param {string} message - Error message to display
     * @param {string} [title="Error"] - Dialog title
     */
    static showErrorDialog(message, title = "Error") {
        this.showMessageDialog(message, title, JOptionPane.ERROR_MESSAGE);
    }

    /**
     * Shows a confirmation dialog
     * @param {string} message - Message to display
     * @param {Function} [onYes] - Callback when Yes is clicked
     * @param {Function} [onNo] - Callback when No is clicked
     * @param {string} [title="Confirm"] - Dialog title
     */
    static showConfirmDialog(message, onYes, onNo, title = "Confirm") {
        SwingUtilities.invokeLater(function () {
            const result = JOptionPane.showConfirmDialog(
                null,
                message,
                title,
                JOptionPane.YES_NO_OPTION,
                JOptionPane.QUESTION_MESSAGE
            );

            if (result === JOptionPane.YES_OPTION && onYes) {
                onYes();
            } else if (result === JOptionPane.NO_OPTION && onNo) {
                onNo();
            }
        });
    }

    /**
     * Shows an input dialog
     * @param {string} message - Message to display
     * @param {Function} [callback] - Callback with the input value
     * @param {string} [title="Input"] - Dialog title
     * @param {string} [initialValue=""] - Initial input value
     */
    static showInputDialog(message, callback, title = "Input", initialValue = "") {
        SwingUtilities.invokeLater(function () {
            const result = JOptionPane.showInputDialog(
                null,
                message,
                title,
                JOptionPane.QUESTION_MESSAGE,
                null,
                null,
                initialValue
            );

            if (callback) {
                callback(result);
            }
        });
    }

    /**
     * Formats date/time duration in a human-readable format
     * @param {number} milliseconds - Duration in milliseconds
     * @param {boolean} [short=false] - Whether to use short format
     * @returns {string} Formatted duration
     */
    static formatDuration(milliseconds, short = false) {
        if (milliseconds < 0) return short ? "0s" : "0 seconds";

        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (short) {
            if (days > 0) return `${days}d ${hours % 24}h`;
            if (hours > 0) return `${hours}h ${minutes % 60}m`;
            if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
            return `${seconds}s`;
        } else {
            const parts = [];

            if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
            if (hours % 24 > 0) parts.push(`${hours % 24} hour${hours % 24 !== 1 ? "s" : ""}`);
            if (minutes % 60 > 0) parts.push(`${minutes % 60} minute${minutes % 60 !== 1 ? "s" : ""}`);
            if (seconds % 60 > 0) parts.push(`${seconds % 60} second${seconds % 60 !== 1 ? "s" : ""}`);

            return parts.join(", ");
        }
    }

    /**
     * Retrieves a window by its ID
     * @param {string} id - Window ID
     * @returns {Object|null} Window object or null if not found
     */
    static getWindow(id) {
        return this.windows[id] || null;
    }

    /**
     * Closes and disposes all windows
     */
    static closeAll() {
        Object.values(this.windows).forEach(window => {
            try {
                if (window.dialog) {
                    window.close();
                } else {
                    window.dispose();
                }
            } catch (e) {
                console.error("Error disposing window: " + e.message);
            }
        });
    }

    /**
     * Creates a debug information window
     * @param {Object} options - Configuration options
     * @param {string} [options.id="debug-window"] - Window ID
     * @param {string} [options.title="Debug Info"] - Window title
     * @param {Object} [options.colorScheme] - Color scheme (defaults to DEBUG)
     * @param {Function} [options.logHandler] - Handler for adding log entries
     * @returns {Object} Created window object
     */
    static createDebugWindow(options = {}) {
        const id = options.id || "debug-window";
        const title = options.title || "Debug Info";
        const colorScheme = options.colorScheme || this.ColorSchemes.DEBUG;

        const window = this.createWindow({
            id: id,
            title: title,
            colorScheme: colorScheme,
            width: 500,
            height: 400,
            closable: true,
            draggable: true,
            resizable: true
        });

        const controlPanel = window.createPanel({
            id: "controls",
            layout: "flow",
            position: BorderLayout.NORTH
        });

        window.createButton({
            id: "clear-btn",
            text: "Clear Log",
            parent: "controls",
            onClick: function () {
                window.updateComponent("log-area", { text: "" });
            }
        });

        window.createCheckbox({
            id: "auto-scroll",
            text: "Auto-scroll",
            parent: "controls",
            selected: true
        });

        const logPanel = window.createPanel({
            id: "log-panel",
            title: "Log Output",
            layout: "border",
            position: BorderLayout.CENTER
        });

        const logArea = window.createTextArea({
            id: "log-area",
            parent: "log-panel",
            text: "",
            rows: 20,
            cols: 50,
            editable: false,
            scrollable: true
        });

        const statusPanel = window.createPanel({
            id: "status-panel",
            layout: "flow",
            position: BorderLayout.SOUTH
        });

        window.createLabel({
            id: "status-label",
            text: "Ready",
            parent: "status-panel"
        });

        window.log = function (message, type = "INFO") {
            const logArea = window.components["log-area"];
            if (!logArea) return;

            const timestamp = new Date().toLocaleTimeString();
            const logEntry = `[${timestamp}] [${type}] ${message}\n`;

            SwingUtilities.invokeLater(function () {
                const currentText = logArea.getText();
                logArea.setText(currentText + logEntry);

                if (window.components["auto-scroll"] && window.components["auto-scroll"].isSelected()) {
                    logArea.setCaretPosition(logArea.getDocument().getLength());
                }

                window.updateComponent("status-label", { text: `Last entry: ${timestamp}` });
            });

            return window;
        };

        window.show();

        return window;
    }

    /**
     * Creates a grid-based data display window
     * @param {Object} options - Configuration options
     * @param {string} [options.id="data-window"] - Window ID
     * @param {string} [options.title="Data Display"] - Window title
     * @param {Object} [options.colorScheme] - Color scheme (defaults to DARK)
     * @param {Array} [options.columns] - Column definitions [{id, name, width}]
     * @param {Array} [options.rows] - Initial data rows
     * @param {Function} [options.updateCallback] - Callback for updating data
     * @returns {Object} Created window object
     */
    static createDataWindow(options = {}) {
        const id = options.id || "data-window";
        const title = options.title || "Data Display";
        const colorScheme = options.colorScheme || this.ColorSchemes.DARK;
        const columns = options.columns || [{ id: "col1", name: "Column 1", width: 100 }];
        const rows = options.rows || [];
        const updateCallback = options.updateCallback || function () { return []; };

        const window = this.createWindow({
            id: id,
            title: title,
            colorScheme: colorScheme,
            width: Math.max(300, columns.reduce((sum, col) => sum + (col.width || 100), 0) + 40),
            height: 300,
            closable: true,
            draggable: true,
            resizable: true
        });

        window.createTable({
            id: "data-table",
            parent: window.contentPanel.getName(),
            headers: columns.map(col => col.name),
            rows: rows,
            editable: false,
            sortable: true,
            region: BorderLayout.CENTER
        });

        window.createTimer({
            interval: 1000,
            callback: function () {
                try {
                    const updatedRows = updateCallback() || [];
                    window.updateTable("data-table", updatedRows);
                } catch (err) {
                    console.error("Error updating data window: " + err.message);
                }
            }
        });

        window.show();

        return window;
    }
}

// Store all created windows for management
SwingUtils.windows = {};
// Color Schemes
SwingUtils.ColorSchemes = {
    DARK: {
        background: new Color(30, 30, 30, 180),
        headerBackground: new Color(40, 40, 40, 220),
        panelBackground: new Color(35, 35, 35, 200),
        accent: new Color(70, 130, 180),
        text: Color.WHITE,
        border: new Color(60, 60, 60)
    },
    LIGHT: {
        background: new Color(240, 240, 240, 180),
        headerBackground: new Color(220, 220, 220, 220),
        panelBackground: new Color(230, 230, 230, 200),
        accent: new Color(70, 130, 180),
        text: Color.BLACK,
        border: new Color(180, 180, 180)
    },
    DEBUG: {
        background: new Color(20, 30, 20, 180),
        headerBackground: new Color(30, 50, 30, 220),
        panelBackground: new Color(25, 35, 25, 200),
        accent: new Color(70, 180, 70),
        text: Color.WHITE,
        border: new Color(40, 100, 40)
    },
    DATA: {
        background: new Color(20, 20, 30, 180),
        headerBackground: new Color(30, 30, 50, 220),
        panelBackground: new Color(25, 25, 35, 200),
        accent: new Color(100, 100, 180),
        text: Color.WHITE,
        border: new Color(60, 60, 100)
    }
};
