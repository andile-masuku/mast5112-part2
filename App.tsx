// imports
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
  SafeAreaView,
  Alert,
  Image,
  FlatList,
  ImageSourcePropType,
} from 'react-native';

// type definitions
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  course: string;
}
// translator from greek to english vise versa
type LanguageCode = 'EN' | 'GR';
type MenuByCourse = {
  [course: string]: MenuItem[];
};


 const LogoImage = require('./assets/menulogo.png');
 const AppLogo: ImageSourcePropType = LogoImage;

// colours for the app
const Colours = {
  AppBackGround: '#122025',
  ListBackGround: '#09161b',
  FloatScreenBG: '#09191B',
  DivisionLine: '#000000',
  MainTextColour: '#FFFFFF',
  HeadingText: '#C1DBE3',
  GrayText: '#999999',
  ButtonColour: '#1A67B1',
  CourseScrollviewBG: '#09161B',
  CourseSVBorder: '#12394c',
  FloatScreen: 'rgba(18, 32, 37, 0.9)',
  ModelBackGround: '#122025',
  ImageHolder: '#2C475A',
  HomeTitle: '#D4E6EC',
  SaveBtn: '#135469',
  DeleteBtn: '#E74C3C',
  ErrorMsg: '#E74C3C',
};

// translated words
const TRANSLATION_MAP: Record<LanguageCode, Record<string, string>> = {
  'EN': {
    'Orektiká': 'Appetizers',
    'Soúpa': 'Soup',
    'Próta Piáto': 'Main Course',
    'Saláta': 'Salad',
    'Glyká': 'Desserts',
    'Potá': 'Drinks',
  },
  'GR': {
    'Appetizers': 'Ορεκτικά',
    'Soup': 'Σούπα',
    'Main Course': 'Πρώτο Πιάτο',
    'Salad': 'Σαλάτα',
    'Desserts': 'Γλυκά',
    'Drinks': 'Ποτά',
  },
};

const translateText = (text: string, currentLang: LanguageCode): string => {
  if (currentLang === 'GR') {
    const originalKey = Object.keys(TRANSLATION_MAP['EN']).find(key => TRANSLATION_MAP['EN'][key] === text) || text;
    return TRANSLATION_MAP['GR'][originalKey] || text;
  }
  if (currentLang === 'EN') {
    const originalKey = Object.keys(TRANSLATION_MAP['GR']).find(key => TRANSLATION_MAP['GR'][key] === text) || text;
    return TRANSLATION_MAP['EN'][originalKey] || text;
  }
  return text;
};

const translateItem = (item: MenuItem, currentLang: LanguageCode): MenuItem => {
  const targetMap = currentLang === 'EN' ? TRANSLATION_MAP['EN'] : TRANSLATION_MAP['GR'];

  const courseKeys = Object.keys(TRANSLATION_MAP['EN']);
  const originalCourseKey = courseKeys.find(key =>
      TRANSLATION_MAP['EN'][key] === item.course ||
      TRANSLATION_MAP['GR'][key] === item.course ||
      key === item.course
  ) || item.course;

  // Translate the course name using the original key
  const translatedCourse = targetMap[originalCourseKey as keyof typeof targetMap] || item.course;

  // appended language markers "(EN)" or "(GR)" for the dish name/description.
  const translatedName = currentLang === 'GR'
    ? item.name.replace(' (EN)', ' (GR)')
    : item.name.replace(' (GR)', ' (EN)');
  const translatedDescription = currentLang === 'GR'
    ? item.description.replace(' (EN)', ' (GR)')
    : item.description.replace(' (GR)', ' (EN)');

  return {
    ...item,
    name: translatedName,
    description: translatedDescription,
    course: translatedCourse,
  };
};

const groupByCourse = (items: MenuItem[]): MenuByCourse => {
  return items.reduce((acc, item) => {
    const courseName = item.course;
    if (!acc[courseName]) {
      acc[courseName] = [];
    }
    acc[courseName].push(item);
    return acc;
  }, {} as MenuByCourse);
};

const DECOY_COURSES = [
  { name: 'Orektiká', price: '€24' },
  { name: 'Soúpa', price: '€28' },
  { name: 'Próta Piáto', price: '€37' },
  { name: 'Saláta', price: '€30' },
];
const COURSES = ['Orektiká', 'Soúpa', 'Próta Piáto', 'Saláta', 'Glyká', 'Potá'];


// flatlist components/model
interface AddItemModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, 'id'>) => void;
  courses: string[];
}

// Helper component for the course picker, as the original mock was just a TextInput
interface CoursePickerModalProps {
  isVisible: boolean;
  courses: string[];
  onSelect: (course: string) => void;
  onClose: () => void;
  currentCourse: string;
}

const CoursePickerModal: React.FC<CoursePickerModalProps> = ({ isVisible, courses, onSelect, onClose, currentCourse }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={isVisible}
    onRequestClose={onClose}
  >
    <View style={modalStyles.centeredView}>
      {/* Reused modalView style for a simplified picker view */}
      <View style={modalStyles.modalView}>
        <Text style={modalStyles.modalTitle}>Select Course</Text>
        <FlatList
          data={courses}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                modalStyles.pickerItem,
                item === currentCourse && modalStyles.pickerItemSelected,
              ]}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Text style={modalStyles.pickerItemText}>{item}</Text>
            </TouchableOpacity>
          )}
          style={{ width: '100%' }}
        />
        <TouchableOpacity style={[modalStyles.buttonSave, { marginTop: 15 }]} onPress={onClose}>
          <Text style={modalStyles.textStyle}>CLOSE</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const AddItemModal: React.FC<AddItemModalProps> = ({ isVisible, onClose, onSave, courses }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [course, setCourse] = useState<string>(courses[0] || '');
  const [nameError, setNameError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [priceError, setPriceError] = useState<boolean>(false);
  const [isCoursePickerVisible, setIsCoursePickerVisible] = useState<boolean>(false);

  const handlePriceChange = (text: string) => {
    // price to only allow numbers
    const cleanText = text.replace(/[^0-9.]/g, '');
    const parts = cleanText.split('.');

    // allows one decimal point
    if (parts.length > 2) {
      setPrice(parts[0] + '.' + parts.slice(1).join(''));
    } else {
      setPrice(cleanText);
    }
    setPriceError(false);
  };

  const handleSave = () => {
    let isValid = true;

    // error checks
    if (!name.trim()) {
      setNameError(true);
      isValid = false;
    } else {
      setNameError(false);
    }

    if (!description.trim()) {
      setDescriptionError(true);
      isValid = false;
    } else {
      setDescriptionError(false);
    }

    const priceValue = parseFloat(price.trim());

    // Check if price is empty or invalid
    if (!price.trim() || price === '.' || isNaN(priceValue)) {
      setPriceError(true);
      isValid = false;
    } else {
      setPriceError(false);
    }

    if (!isValid) {
      Alert.alert('Missing Information', 'Please fill in all needed info (Name, Description, and a valid Price) before saving.');
      return;
    }

    onSave({
      name: name.trim() + ' (EN)', // Added language tag for translation demo
      description: description.trim() + ' (EN)', // Added language tag
      price: `€${priceValue.toFixed(2)}`,
      course, // using the greek course name as the accepted key
    });

    // clear and closing float screen
    setName('');
    setDescription('');
    setPrice('');
    setCourse(courses[0] || '');
    setNameError(false);
    setDescriptionError(false);
    setPriceError(false);
    onClose();
  };

  return (
    <>
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={[modalStyles.modalView, { backgroundColor: Colours.ListBackGround }]}>
          <Text style={modalStyles.modalTitle}>Add New Menu Item</Text>

          <TextInput
            style={[modalStyles.input, nameError && modalStyles.inputError]}
            placeholder="Item Name"
            placeholderTextColor={Colours.GrayText}
            value={name}
            onChangeText={setName}
            onBlur={() => setNameError(!name.trim())}
          />
          {nameError && <Text style={modalStyles.errorText}>Item Name needed.</Text>}

          <TextInput
            style={[modalStyles.input, descriptionError && modalStyles.inputError, { height: 80 }]}
            placeholder="Description"
            placeholderTextColor={Colours.GrayText}
            value={description}
            onChangeText={setDescription}
            onBlur={() => setDescriptionError(!description.trim())}
            multiline
          />
          {descriptionError && <Text style={modalStyles.errorText}>Description needed.</Text>}

          <TextInput
            style={[modalStyles.input, priceError && modalStyles.inputError]}
            placeholder="Price of dish"
            placeholderTextColor={Colours.GrayText}
            keyboardType="numeric"
            value={price}
            onChangeText={handlePriceChange}
            onBlur={() => setPriceError(!price.trim() || price === '.' || isNaN(parseFloat(price.trim())))}
          />
          {priceError && <Text style={modalStyles.errorText}>Valid Price needed (numbers only).</Text>}

          <View style={modalStyles.pickerContainer}>
            <TouchableOpacity
              style={modalStyles.pickerMock}
              onPress={() => setIsCoursePickerVisible(true)}
            >
              <Text style={modalStyles.pickerInputMock}>
                {course}
              </Text>
              <Text style={modalStyles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={modalStyles.buttonSave}
            onPress={handleSave}
          >
            <Text style={modalStyles.textStyle}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    <CoursePickerModal
        isVisible={isCoursePickerVisible}
        courses={courses}
        onSelect={setCourse}
        onClose={() => setIsCoursePickerVisible(false)}
        currentCourse={course}
    />
    </>
  );
};

// Home Screen
const HomeScreen: React.FC<{ menuItems: MenuItem[] }> = ({ menuItems }) => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>('EN');
  const languages: LanguageCode[] = ['GR', 'EN'];
  const nextLang: LanguageCode = languages.find(lang => lang !== currentLang) || 'GR';

  const handleTranslate = () => {
    setCurrentLang(nextLang);
  };

  const translatedItems = useMemo(() => {
    return menuItems.map(item => translateItem(item, currentLang));
  }, [menuItems, currentLang]);

  const menuByCourse = useMemo(() => {
    return groupByCourse(translatedItems);
  }, [translatedItems]);

  const courseKeys = Object.keys(menuByCourse);

  const RenderMenuItem: React.FC<{ item: MenuItem }> = ({ item }) => (
    <View style={homeStyles.menuItemWrapper}>
      <View style={homeStyles.itemImagePlaceholder}>
        <Text style={homeStyles.itemImageText}>🍝</Text>
      </View>
      <Text style={homeStyles.itemName}>{item.name}</Text>
      <Text style={homeStyles.itemPrice}>{item.price}</Text>
      <Text style={homeStyles.itemDescription} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
    </View>
  );

  // Component to render items for a single course
  const RenderCourseSection: React.FC<{ course: string, items: MenuItem[] }> = ({ course, items }) => (
    <View style={homeStyles.courseSectionContainer}>
      <Text style={homeStyles.courseSectionTitle}>{course}</Text>
      <FlatList
        data={items}
        renderItem={({ item }) => <RenderMenuItem item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={homeStyles.row}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <View style={homeStyles.screen}>
      <View style={homeStyles.titleSection}>
        <TouchableOpacity style={homeStyles.translatorPill} onPress={handleTranslate}>
          <Text style={homeStyles.translatorPillText}>{nextLang}</Text>
        </TouchableOpacity>

        <View style={homeStyles.appNameContainer}>
          <Text style={homeStyles.appName}>Fengarófotis</Text>
          <Text style={homeStyles.appSubName}>Psichés</Text>
        </View>

        <Image source={AppLogo} style={homeStyles.logoImage} />
      </View>

      {/*Decoy Horizontal */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={homeStyles.decoyScrollView}
        contentContainerStyle={homeStyles.decoyScrollViewContent}
      >
        {DECOY_COURSES.map((course, index) => (
          <View key={index} style={homeStyles.coursePill}>
            <Text style={homeStyles.courseName}>{translateText(course.name, currentLang)}</Text>
            <Text style={homeStyles.coursePrice}>{course.price}</Text>
          </View>
        ))}
      </ScrollView>

      {/*Menu List (Grouped by Course)*/}
      <View style={homeStyles.listContainer}>
        {courseKeys.length === 0 ? (
          <View style={homeStyles.emptyList}>
            <Text style={homeStyles.emptyText}>
              Added items/dishes will be shown here
            </Text>
          </View>
        ) : (
          <FlatList
            data={courseKeys}
            renderItem={({ item: course }) => (
              <RenderCourseSection course={course} items={menuByCourse[course]} />
            )}
            keyExtractor={(course) => course}
            showsVerticalScrollIndicator={false}
            // Disabling FlatList scroll when inside a ScrollView, but enabling it for the main list in MenuManagementScreen
            scrollEnabled={false}
          />
        )}
      </View>
      <Text style={homeStyles.totalItems}>Total Items: {menuItems.length}</Text>
    </View>
  );
};

// Menu Management Screen
interface MenuManagementScreenProps {
  onOpenModal: () => void;
  managedItems: MenuItem[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

const MenuManagementScreen: React.FC<MenuManagementScreenProps> = ({
  onOpenModal,
  managedItems,
  selectedItemId,
  onSelectItem,
  onDeleteItem,
  onClearAll,
}) => {

  const RenderManagedItem: React.FC<{ item: MenuItem }> = ({ item }) => {
    const isSelected = item.id === selectedItemId;

    return (
      <TouchableOpacity
        style={[managementStyles.mockItemCard, isSelected && managementStyles.mockItemCardSelected]}
        onPress={() => onSelectItem(isSelected ? null : item.id)}
      >
        {/* Dish Name and Price in a CardView style */}
        <View style={managementStyles.itemHeaderRow}>
          <Text style={managementStyles.itemCourseName}>{item.name.replace(' (EN)', '').replace(' (GR)', '')}</Text>
          <Text style={managementStyles.itemPriceName}>{item.price}</Text>
        </View>

        <View style={managementStyles.itemContentRow}>
          <View style={managementStyles.itemImagePlaceholder}>
            <Text style={managementStyles.itemImageText}>🍛</Text>
          </View>
          <View style={managementStyles.itemDetails}>
            <Text style={managementStyles.itemCoursePill}>{item.course}</Text>
          </View>
        </View>

        {/* Action buttons */}
        {isSelected && (
          <View style={managementStyles.actionButtons}>
            <TouchableOpacity style={managementStyles.saveButton}
              onPress={() => Alert.alert('Save Item', `Pretend this saved changes to ${item.name}`)}>
              <Text style={managementStyles.saveButtonText}>SAVE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={managementStyles.deleteButton}
              onPress={() => onDeleteItem(item.id)}>
              <Text style={managementStyles.deleteButtonText}>DELETE</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={managementStyles.screen}>


      {/* translates to welscome chef Christoffel */}
      <View style={managementStyles.titleSection}>
        <Text style={managementStyles.appName}>Kalosirisate</Text>
        <Text style={managementStyles.appSubName}>Sef Christofel</Text>
        <Image source={AppLogo} style={managementStyles.logoImage} />
      </View>

      {/* Search Bar*/}
      <View style={managementStyles.searchBarContainer}>
        <Text style={managementStyles.searchIcon}>🔍</Text>
        <TextInput
          style={managementStyles.searchInput}
          placeholder="Search Item"
          placeholderTextColor={Colours.GrayText}
        />
      </View>
      <View style={managementStyles.searchResultsContainer}>
        <Text style={managementStyles.searchResultsText}>Search Results</Text>
      </View>

      <View style={managementStyles.addItemContainer}>
        <Text style={managementStyles.addItemText}>Add Menu Item</Text>
        <TouchableOpacity style={managementStyles.addButton} onPress={onOpenModal}>
          <Text style={managementStyles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* List for items to be managed */}
      <View style={managementStyles.listContainer}>
        {managedItems.length === 0 ? (
          <View style={managementStyles.emptyList}>
            <Text style={managementStyles.emptyText}>
              Add new dishes/items.
            </Text>
          </View>
        ) : (
          <FlatList
            data={managedItems}
            renderItem={({ item }) => <RenderManagedItem item={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* clear all*/}
      <TouchableOpacity style={managementStyles.clearAllButton} onPress={onClearAll}>
        <Text style={managementStyles.clearAllButtonText}>CLEAR ALL</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main App
const App = () => {
  const [homeMenuItems, setHomeMenuItems] = useState<MenuItem[]>([]);
  const [managedItems, setManagedItems] = useState<MenuItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleAddItem = (newItem: Omit<MenuItem, 'id'>) => {
    const newItemWithId: MenuItem = {
      ...newItem,
      id: Date.now().toString(),
    };

    setHomeMenuItems(prevItems => [newItemWithId, ...prevItems]);
    setManagedItems(prevItems => [newItemWithId, ...prevItems]);
  };

  const handleDeleteItem = (itemId: string) => {
    setManagedItems(prev => prev.filter(item => item.id !== itemId));
    setHomeMenuItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItemId(null);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Confirm Clear All",
      "Are you sure you want to clear all added items? This can not be retrieved",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All", style: 'destructive', onPress: () => {
            setHomeMenuItems([]);
            setManagedItems([]);
            setSelectedItemId(null);
          }
        }
      ]
    );
  };


  return (
    <SafeAreaView style={styles.appContainer}>
      <ScrollView
        style={styles.fullScroll}
        showsVerticalScrollIndicator={false}
      >
        <HomeScreen menuItems={homeMenuItems} />

        <View style={styles.divider} />

        <MenuManagementScreen
          onOpenModal={() => setIsModalVisible(true)}
          managedItems={managedItems}
          selectedItemId={selectedItemId}
          onSelectItem={setSelectedItemId}
          onDeleteItem={handleDeleteItem}
          onClearAll={handleClearAll}
        />

      </ScrollView>

      <AddItemModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSave={handleAddItem}
        courses={COURSES}
      />
    </SafeAreaView>
  );
};

// stylesheet

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: Colours.AppBackGround,
  },
  fullScroll: {
    flex: 1,
    paddingBottom: 20,
  },
  divider: {
    height: 3,
    backgroundColor: Colours.DivisionLine,
    width: '100%',
  },
});
const commonStyles = StyleSheet.create({
  screen: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 5,
    backgroundColor: Colours.AppBackGround,
  },
  titleSection: {
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
    marginBottom: 5,
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 3,
    position: 'absolute',
    right: 1,
    top: 1,
    borderWidth: 0.2,
    borderColor: Colours.HeadingText,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colours.HomeTitle,
    fontStyle: 'italic',
  },
  appSubName: {
    fontSize: 18,
    color: Colours.HomeTitle,
    fontStyle: 'italic',
  },
  listContainer: {
    minHeight: 200,
    backgroundColor: Colours.AppBackGround,
    borderRadius: 8,
    padding: 5,
    marginVertical: 10,
    flexGrow: 1,
  },
  itemImagePlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: Colours.ImageHolder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemImageText: {
    fontSize: 30,
    color: Colours.MainTextColour,
  },
  itemName: {
    color: Colours.MainTextColour,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  itemDescription: {
    color: Colours.GrayText,
    fontSize: 12,
    marginTop: 2,
  },
  itemPrice: {
    color: Colours.HeadingText,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
});

const homeStyles = StyleSheet.create({
  ...commonStyles,
  titleSection: {
    ...(commonStyles.titleSection as object),
    flexDirection: 'row', // Align logo, name, and scrollview horizontally
    justifyContent: 'center',
    alignItems: 'center',
  },
  appNameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  translatorPill: {
    backgroundColor: Colours.CourseScrollviewBG,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colours.CourseSVBorder,
    position: 'absolute',
    left: 15,
    top: 18,
    zIndex: 10,
  },
  translatorPillText: {
    color: Colours.HeadingText,
    fontWeight: 'bold',
    fontSize: 14,
  },
  decoyScrollView: {
    maxHeight: 60,
    marginVertical: 15,
  },
  decoyScrollViewContent: {
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  coursePill: {
    backgroundColor: Colours.CourseScrollviewBG,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: Colours.CourseSVBorder,
  },
  courseName: {
    color: Colours.MainTextColour,
    fontWeight: 'bold',
    fontSize: 14,
  },
  coursePrice: {
    color: Colours.HeadingText,
    fontSize: 12,
  },

  courseSectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  courseSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colours.HeadingText,
    marginBottom: 10,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  menuItemWrapper: {
    width: '48%',
    backgroundColor: Colours.ListBackGround,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    color: Colours.GrayText,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  totalItems: {
    color: Colours.MainTextColour,
    textAlign: 'center',
    paddingVertical: 5,
    backgroundColor: Colours.ListBackGround,
    marginBottom: 10,
    borderRadius: 8,
  }
});

const managementStyles = StyleSheet.create({
  ...commonStyles,
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colours.ListBackGround,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchIcon: {
    color: Colours.HeadingText,
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: Colours.MainTextColour,
  },
  searchResultsContainer: {
    backgroundColor: Colours.ListBackGround,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchResultsText: {
    color: Colours.HeadingText,
    fontSize: 16,
    fontWeight: 'bold',
  },

  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: Colours.GrayText,
    marginVertical: 10,
  },
  addItemText: {
    color: Colours.HeadingText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: Colours.AppBackGround,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colours.HeadingText,
  },
  addButtonText: {
    color: Colours.HeadingText,
    fontSize: 20,
    fontWeight: 'bold',
  },

  mockItemCard: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: Colours.ListBackGround,
    borderRadius: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: Colours.ListBackGround,
  },
  mockItemCardSelected: {
    borderWidth: 2,
    borderColor: Colours.ButtonColour,
  },
  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemCourseName: {
    color: Colours.MainTextColour,
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemPriceName: {
    color: Colours.HeadingText,
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  itemCoursePill: {
    color: Colours.GrayText,
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-start',
    backgroundColor: Colours.CourseScrollviewBG,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colours.ImageHolder,
  },
  saveButton: {
    backgroundColor: Colours.HeadingText,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginRight: 20,
  },
  saveButtonText: {
    color: Colours.DivisionLine,
    fontWeight: 'bold',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: Colours.DeleteBtn,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: Colours.MainTextColour,
    fontWeight: 'bold',
    fontSize: 14,
  },
  clearAllButton: {
    borderWidth: 1,
    borderColor: Colours.HeadingText,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  clearAllButtonText: {
    color: Colours.HeadingText,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 150,
  },
  emptyText: {
    color: Colours.GrayText,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colours.FloatScreen,
  },
  modalView: {
    margin: 20,
    backgroundColor: Colours.ModelBackGround,
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: '90%',
  },
  modalTitle: {
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: Colours.MainTextColour,
  },
  input: {
    height: 45,
    width: '100%',
    borderColor: Colours.GrayText,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 5,
    backgroundColor: Colours.FloatScreenBG,
    color: Colours.MainTextColour,
  },
  inputError: {
    borderColor: Colours.ErrorMsg,
    borderWidth: 2,
  },
  errorText: {
    color: Colours.ErrorMsg,
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginBottom: 10,
    fontSize: 12,
  },
  pickerContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  pickerMock: {
    height: 45,
    width: '100%',
    borderColor: Colours.GrayText,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: Colours.FloatScreenBG,
  },
  pickerInputMock: {
    flex: 1,
    color: Colours.MainTextColour,
    fontSize: 16,
  },
  dropdownIcon: {
    color: Colours.GrayText,
    fontSize: 12,
  },
  buttonSave: {
    backgroundColor: Colours.HeadingText,
    borderRadius: 5,
    padding: 12,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
  },
  textStyle: {
    color: Colours.DivisionLine,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  pickerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colours.GrayText,
    width: '100%',
    alignItems: 'center',
  },
  pickerItemText: {
    color: Colours.MainTextColour,
    fontSize: 16,
  },
  pickerItemSelected: {
    backgroundColor: Colours.ButtonColour,
  },
});

export default App;