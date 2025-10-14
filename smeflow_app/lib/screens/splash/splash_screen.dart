import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smeflow_app/config/app_theme.dart';
import 'package:smeflow_app/providers/auth_provider.dart';
import 'dart:math' as math;

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _fadeController;
  late AnimationController _scaleController;
  late AnimationController _colorController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;
  late Animation<Color?> _colorAnimation;

  final List<Color> _cityscapeColors = [
    AppTheme.bgGreen,
    AppTheme.bgBlue,
    AppTheme.bgPink,
    AppTheme.bgOrange,
  ];

  int _colorIndex = 0;

  @override
  void initState() {
    super.initState();

    // Fade animation
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _fadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeIn,
    );

    // Scale animation
    _scaleController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _scaleAnimation = CurvedAnimation(
      parent: _scaleController,
      curve: Curves.elasticOut,
    );

    // Color transition animation
    _colorController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );

    _colorAnimation = ColorTween(
      begin: _cityscapeColors[0],
      end: _cityscapeColors[1],
    ).animate(_colorController);

    // Start animations
    _startAnimations();

    // Navigate after delay - go to landing page first
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/landing');
      }
    });
  }

  void _startAnimations() async {
    await Future.delayed(const Duration(milliseconds: 300));
    _fadeController.forward();
    _scaleController.forward();

    // Cycle through colors
    _cycleColors();
  }

  void _cycleColors() {
    _colorController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        setState(() {
          _colorIndex = (_colorIndex + 1) % _cityscapeColors.length;
          _colorAnimation = ColorTween(
            begin: _cityscapeColors[_colorIndex],
            end: _cityscapeColors[(_colorIndex + 1) % _cityscapeColors.length],
          ).animate(_colorController);
        });
        _colorController.reset();
        _colorController.forward();
      }
    });
    _colorController.forward();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _scaleController.dispose();
    _colorController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _colorAnimation,
      builder: (context, child) {
        return Scaffold(
          body: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  _colorAnimation.value ?? _cityscapeColors[0],
                  (_colorAnimation.value ?? _cityscapeColors[0])
                      .withOpacity(0.7),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: child,
          ),
        );
      },
      child: Stack(
        children: [
          // Animated cityscape silhouettes
          ...List.generate(
            5,
            (index) => Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: AnimatedBuilder(
                animation: _fadeController,
                builder: (context, child) {
                  return Opacity(
                    opacity: _fadeAnimation.value * 0.3,
                    child: Transform.translate(
                      offset: Offset(
                        0,
                        50 * (1 - _fadeAnimation.value) * (index + 1),
                      ),
                      child: CustomPaint(
                        size: Size(
                          MediaQuery.of(context).size.width,
                          150 - (index * 20.0),
                        ),
                        painter: CityscapePainter(
                          index: index,
                          color: AppTheme.textPrimary.withOpacity(0.1),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),

          // Main content
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Animated logo/icon
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: ScaleTransition(
                    scale: _scaleAnimation,
                    child: Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primaryGreen.withOpacity(0.3),
                            blurRadius: 30,
                            spreadRadius: 10,
                          ),
                        ],
                      ),
                      child: Center(
                        child: Icon(
                          Icons.store_rounded,
                          size: 60,
                          color: AppTheme.primaryGreen,
                        ),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 32),

                // App name
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: ShaderMask(
                    shaderCallback: (bounds) => LinearGradient(
                      colors: [
                        AppTheme.primaryGreen,
                        AppTheme.primaryRed,
                      ],
                    ).createShader(bounds),
                    child: Text(
                      'SmeFlow',
                      style: Theme.of(context).textTheme.displayLarge?.copyWith(
                            color: Colors.white,
                            fontSize: 48,
                            letterSpacing: -1.5,
                          ),
                    ),
                  ),
                ),

                const SizedBox(height: 12),

                // Tagline
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: Text(
                    'Empowering Kenyan SMEs',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: AppTheme.textPrimary.withOpacity(0.7),
                          letterSpacing: 1,
                        ),
                  ),
                ),

                const SizedBox(height: 60),

                // Loading indicator
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: SizedBox(
                    width: 40,
                    height: 40,
                    child: CircularProgressIndicator(
                      strokeWidth: 3,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppTheme.primaryGreen,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Bottom branding
          Positioned(
            bottom: 40,
            left: 0,
            right: 0,
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 30,
                        height: 4,
                        decoration: BoxDecoration(
                          color: AppTheme.primaryGreen,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        width: 30,
                        height: 4,
                        decoration: BoxDecoration(
                          color: AppTheme.textPrimary.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        width: 30,
                        height: 4,
                        decoration: BoxDecoration(
                          color: AppTheme.primaryRed,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '🇰🇪 Made in Kenya',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppTheme.textSecondary,
                          fontSize: 13,
                        ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Custom painter for cityscape silhouettes
class CityscapePainter extends CustomPainter {
  final int index;
  final Color color;

  CityscapePainter({required this.index, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    final random = math.Random(index);

    path.moveTo(0, size.height);

    // Create random building silhouettes
    double x = 0;
    while (x < size.width) {
      final buildingWidth = 40 + random.nextDouble() * 60;
      final buildingHeight = 30 + random.nextDouble() * (size.height - 30);

      path.lineTo(x, size.height - buildingHeight);
      path.lineTo(x + buildingWidth, size.height - buildingHeight);
      path.lineTo(x + buildingWidth, size.height);

      x += buildingWidth;
    }

    path.lineTo(size.width, size.height);
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
