import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'config/app_theme.dart';
import 'services/storage_service.dart';
import 'providers/auth_provider.dart';
import 'providers/business_provider.dart';
import 'providers/category_provider.dart';
import 'providers/product_provider.dart';
import 'providers/review_provider.dart';
import 'providers/tender_provider.dart';
import 'screens/splash/splash_screen.dart';
import 'screens/landing/landing_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/main/main_nav_screen.dart';
import 'screens/business/business_detail_screen.dart';
import 'screens/business/create_business_screen.dart';
import 'screens/tenders/tender_detail_screen.dart';
import 'screens/tenders/post_tender_screen.dart';
import 'screens/tenders/place_bid_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize storage service
  await StorageService.init();

  runApp(const SmeFlowApp());
}

class SmeFlowApp extends StatelessWidget {
  const SmeFlowApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => BusinessProvider()),
        ChangeNotifierProvider(create: (_) => CategoryProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()),
        ChangeNotifierProvider(create: (_) => ReviewProvider()),
        ChangeNotifierProvider(create: (_) => TenderProvider()),
      ],
      child: MaterialApp(
        title: 'SmeFlow',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        initialRoute: '/',
        routes: {
          '/': (context) => const SplashScreen(),
          '/landing': (context) => const LandingScreen(),
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
          '/home': (context) => const MainNavScreen(),
          '/create-business': (context) => const CreateBusinessScreen(),
          '/post-tender': (context) => const PostTenderScreen(),
        },
        onGenerateRoute: (settings) {
          if (settings.name == '/business-detail') {
            final businessId = settings.arguments as String;
            return MaterialPageRoute(
              builder: (context) => BusinessDetailScreen(businessId: businessId),
            );
          }
          if (settings.name == '/tender-detail') {
            final tenderId = settings.arguments as String;
            return MaterialPageRoute(
              builder: (context) => TenderDetailScreen(tenderId: tenderId),
            );
          }
          if (settings.name == '/place-bid') {
            final tenderId = settings.arguments as String;
            return MaterialPageRoute(
              builder: (context) => PlaceBidScreen(tenderId: tenderId),
            );
          }
          return null;
        },
      ),
    );
  }
}

